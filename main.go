package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"mime"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/go-ns/handlers/reverseProxy"
	"github.com/ONSdigital/go-ns/log"
	"github.com/ONSdigital/go-ns/server"
	"github.com/gorilla/pat"
	"github.com/gorilla/websocket"
)

var bindAddr = ":8080"
var babbageURL = "http://localhost:8080"
var zebedeeURL = "http://localhost:8082"
var tableRendererURL = "http://localhost:23300"
var enableNewApp = false
var mongoURI = "localhost:27017"

var getAsset = assets.Asset
var getAssetETag = assets.GetAssetETag
var upgrader = websocket.Upgrader{}

// Version is set by the make target
var Version string

func main() {
	log.Debug("florence version", log.Data{"version": Version})

	if v := os.Getenv("BIND_ADDR"); len(v) > 0 {
		bindAddr = v
	}
	if v := os.Getenv("BABBAGE_URL"); len(v) > 0 {
		babbageURL = v
	}
	if v := os.Getenv("ZEBEDEE_URL"); len(v) > 0 {
		zebedeeURL = v
	}
	if v := os.Getenv("TABLE_RENDERER_URL"); len(v) > 0 {
		tableRendererURL = v
	}

	log.Namespace = "florence"

	/*
		NOTE:
		If there's any issues with this Florence server proxying redirects
		from either Babbage or Zebedee then the code in the previous Java
		Florence server might give some clues for a solution: https://github.com/ONSdigital/florence/blob/b13df0708b30493b98e9ce239103c59d7f409f98/src/main/java/com/github/onsdigital/florence/filter/Proxy.java#L125-L135

		The code has purposefully not been included in this Go replacement
		because we can't see what issue it's fixing and whether it's necessary.
	*/

	babbageURL, err := url.Parse(babbageURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	babbageProxy := createBabbageProxy(babbageURL, nil)

	zebedeeURL, err := url.Parse(zebedeeURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	zebedeeProxy := reverseProxy.Create(zebedeeURL, zebedeeDirector)

	tableURL, err := url.Parse(tableRendererURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	tableProxy := reverseProxy.Create(tableURL, tableDirector)

	router := pat.New()

	router.Handle("/zebedee/{uri:.*}", zebedeeProxy)
	router.Handle("/table/{uri:.*}", tableProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence/", redirectToFlorence)
	router.HandleFunc("/florence/index.html", redirectToFlorence)
	router.HandleFunc("/florence/publishing-queue", legacyIndexFile)
	router.HandleFunc("/florence/reports", legacyIndexFile)
	router.HandleFunc("/florence/users-and-access", legacyIndexFile)
	router.HandleFunc("/florence/workspace", legacyIndexFile)
	router.HandleFunc("/florence/websocket", websocketHandler)
	router.HandleFunc("/florence{uri:.*}", refactoredIndexFile)
	router.Handle("/{uri:.*}", babbageProxy)

	log.Debug("Starting server", log.Data{
		"bind_addr":          bindAddr,
		"babbage_url":        babbageURL,
		"zebedee_url":        zebedeeURL,
		"table_renderer_url": tableRendererURL,
		"enable_new_app":     enableNewApp,
	})

	s := server.New(bindAddr, router)
	// TODO need to reconsider default go-ns server timeouts
	s.Server.IdleTimeout = 120 * time.Second
	s.Server.WriteTimeout = 120 * time.Second
	s.Server.ReadTimeout = 30 * time.Second
	s.MiddlewareOrder = []string{"RequestID", "Log"}

	// FIXME temporary hack to remove timeout middleware (doesn't support hijacker interface)
	mo := s.MiddlewareOrder
	var newMo []string
	for _, mw := range mo {
		if mw != "Timeout" {
			newMo = append(newMo, mw)
		}
	}
	s.MiddlewareOrder = newMo

	if err := s.ListenAndServe(); err != nil {
		log.Error(err, nil)
		os.Exit(2)
	}
}

func redirectToFlorence(w http.ResponseWriter, req *http.Request) {
	http.Redirect(w, req, "/florence", 301)
}

func staticFiles(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":uri")
	assetPath := "../dist/" + path

	etag, err := getAssetETag(assetPath)

	if hdr := req.Header.Get("If-None-Match"); len(hdr) > 0 && hdr == etag {
		w.WriteHeader(http.StatusNotModified)
		return
	}

	b, err := getAsset(assetPath)
	if err != nil {
		log.Error(err, nil)
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`ETag`, etag)
	w.Header().Set(`Cache-Control`, "no-cache")
	w.Header().Set(`Content-Type`, mime.TypeByExtension(filepath.Ext(path)))
	w.WriteHeader(200)
	w.Write(b)
}

func legacyIndexFile(w http.ResponseWriter, req *http.Request) {
	log.Debug("Getting legacy HTML file", nil)

	b, err := getAsset("../dist/legacy-assets/index.html")
	if err != nil {
		log.Error(err, nil)
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`Content-Type`, "text/html")
	w.WriteHeader(200)
	w.Write(b)
}

func refactoredIndexFile(w http.ResponseWriter, req *http.Request) {
	log.Debug("Getting refactored HTML file", nil)

	b, err := getAsset("../dist/refactored.html")
	if err != nil {
		log.Error(err, nil)
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`Content-Type`, "text/html")
	w.WriteHeader(200)
	w.Write(b)
}

func zebedeeDirector(req *http.Request) {
	if c, err := req.Cookie(`access_token`); err == nil && len(c.Value) > 0 {
		req.Header.Set(`X-Florence-Token`, c.Value)
	}
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/zebedee")
}

func tableDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/table")
}

func websocketHandler(w http.ResponseWriter, req *http.Request) {
	c, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.ErrorR(req, err, nil)
		return
	}

	defer c.Close()

	err = c.WriteJSON(florenceServerEvent{"version", florenceVersionPayload{Version: Version}})
	if err != nil {
		log.ErrorR(req, err, nil)
		return
	}

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.ErrorR(req, err, nil)
			break
		}

		rdr := bufio.NewReader(bytes.NewReader(message))
		b, err := rdr.ReadBytes('{')
		if err != nil {
			log.ErrorR(req, err, log.Data{"bytes": string(b)})
			continue
		}

		tags := strings.Split(string(b), ":")
		eventID := tags[0]
		eventType := tags[1]
		eventData := message[len(eventID)+len(eventType)+2:]

		switch eventType {
		case "log":
			var e florenceLogEvent
			e.ServerTimestamp = time.Now().UTC().Format("2006-01-02T15:04:05.000-0700Z")
			err = json.Unmarshal(eventData, &e)
			if err != nil {
				log.ErrorR(req, err, log.Data{"data": string(eventData)})
				continue
			}
			log.Debug("client log", log.Data{"data": e})

			err = c.WriteJSON(florenceServerEvent{"ack", eventID})
			if err != nil {
				log.ErrorR(req, err, nil)
			}
		default:
			log.DebugR(req, "unknown event type", log.Data{"type": eventType, "data": string(eventData)})
		}

		// err = c.WriteMessage(mt, message)
		// if err != nil {
		// 	log.ErrorR(req, err, nil)
		// 	break
		// }
	}
}

// FIXME this is to fix go-ns reverse proxy replacing host name so that
// babbage has correct values when using {{location.hostname}} in handlebars
func createBabbageProxy(proxyURL *url.URL, directorFunc func(*http.Request)) http.Handler {
	proxy := httputil.NewSingleHostReverseProxy(proxyURL)
	director := proxy.Director
	proxy.Transport = &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   5 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		MaxIdleConns:          100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   5 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	}
	proxy.Director = func(req *http.Request) {
		director(req)
		//req.Host = proxyURL.Host
		if directorFunc != nil {
			directorFunc(req)
		}
	}

	return proxy
}

type florenceLogEvent struct {
	ServerTimestamp string      `json:"-"`
	ClientTimestamp time.Time   `json:"clientTimestamp"`
	Type            string      `json:"type"`
	Location        string      `json:"location"`
	InstanceID      string      `json:"instanceID"`
	Payload         interface{} `json:"payload"`
}

type florenceServerEvent struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type florenceVersionPayload struct {
	Version string `json:"version"`
}
