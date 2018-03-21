package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
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
var mapRendererURL = "http://localhost:23500"
var enableNewApp = false

var getAsset = assets.Asset
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
	if v := os.Getenv("MAP_RENDERER_URL"); len(v) > 0 {
		mapRendererURL = v
	}
	if v := os.Getenv("ENABLE_NEW_APP"); len(v) > 0 {
		enableNewApp, _ = strconv.ParseBool(v)
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

	babbageProxy := reverseProxy.Create(babbageURL, nil)

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

	mapURL, err := url.Parse(mapRendererURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	mapProxy := reverseProxy.Create(mapURL, mapDirector)

	router := pat.New()

	newAppHandler := refactoredIndexFile

	if !enableNewApp {
		newAppHandler = legacyIndexFile
	}

	router.Handle("/zebedee/{uri:.*}", zebedeeProxy)
	router.Handle("/table/{uri:.*}", tableProxy)
	router.Handle("/map/{uri:.*}", mapProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence", newAppHandler)
	router.HandleFunc("/florence/index.html", legacyIndexFile)
	router.HandleFunc("/florence/websocket", websocketHandler)
	router.HandleFunc("/florence{uri:|/.*}", newAppHandler)
	router.Handle("/{uri:.*}", babbageProxy)

	log.Debug("Starting server", log.Data{
		"bind_addr":          bindAddr,
		"babbage_url":        babbageURL,
		"zebedee_url":        zebedeeURL,
		"table_renderer_url": tableRendererURL,
		"map_renderer_url": mapRendererURL,
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

func staticFiles(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":uri")

	b, err := getAsset("../dist/" + path)
	if err != nil {
		log.Error(err, nil)
		w.WriteHeader(404)
		return
	}

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

func mapDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/map")
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
