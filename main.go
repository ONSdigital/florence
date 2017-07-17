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

	mgo "gopkg.in/mgo.v2"

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
var enableNewApp = false
var mongoURI = "localhost:27017"

var getAsset = assets.Asset
var upgrader = websocket.Upgrader{}
var session *mgo.Session

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

	router := pat.New()

	newAppHandler := refactoredIndexFile

	if !enableNewApp {
		newAppHandler = legacyIndexFile
	}

	router.Handle("/zebedee/{uri:.*}", zebedeeProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence", legacyIndexFile)
	router.HandleFunc("/florence/index.html", redirectToFlorence)
	router.HandleFunc("/florence/collections", legacyIndexFile)
	router.HandleFunc("/florence/publishing-queue", legacyIndexFile)
	router.HandleFunc("/florence/reports", legacyIndexFile)
	router.HandleFunc("/florence/users-and-access", legacyIndexFile)
	router.HandleFunc("/florence/websocket", websocketHandler)
	router.HandleFunc("/florence{uri:/.*}", newAppHandler)
	router.Handle("/{uri:.*}", babbageProxy)

	log.Debug("Starting server", log.Data{
		"bind_addr":      bindAddr,
		"babbage_url":    babbageURL,
		"zebedee_url":    zebedeeURL,
		"enable_new_app": enableNewApp,
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

		log.DebugR(req, "websocket recv", log.Data{"data": string(message)})

		rdr := bufio.NewReader(bytes.NewReader(message))
		b, err := rdr.ReadBytes(':')
		if err != nil {
			log.ErrorR(req, err, nil)
			continue
		}

		eventType := string(b[:len(b)-1])
		eventData := message[len(eventType)+1:]

		switch eventType {
		case "event":
			log.DebugR(req, "event", log.Data{"type": eventType, "data": string(eventData)})
			var e florenceLogEvent
			err = json.Unmarshal(eventData, &e)
			if err != nil {
				log.ErrorR(req, err, nil)
				continue
			}
			log.Debug("client log", log.Data{"data": e})
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
	Created         time.Time   `json:"-"`
	ClientTimestamp time.Time   `json:"clientTimestamp"`
	Type            string      `json:"type"`
	Location        string      `json:"location"`
	InstanceID      int         `json:"instanceID"`
	Payload         interface{} `json:"payload"`
}

type florenceServerEvent struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type florenceVersionPayload struct {
	Version string `json:"version"`
}
