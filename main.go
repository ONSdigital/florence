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

func main() {
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
	if v := os.Getenv("MONGO_URI"); len(v) > 0 {
		if v == "-" {
			mongoURI = ""
		} else {
			mongoURI = v
		}
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

	var err error
	if len(mongoURI) > 0 {
		session, err = mgo.Dial(mongoURI)
		if err != nil {
			panic(err)
		}
		defer session.Close()
	}

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
	router.HandleFunc("/florence", newAppHandler)
	router.HandleFunc("/florence/index.html", legacyIndexFile)
	router.HandleFunc("/florence/websocket", websocketHandler)
	router.HandleFunc("/florence{uri:|/.*}", newAppHandler)
	router.Handle("/{uri:.*}", babbageProxy)

	log.Debug("Starting server", log.Data{
		"bind_addr":      bindAddr,
		"babbage_url":    babbageURL,
		"zebedee_url":    zebedeeURL,
		"enable_new_app": enableNewApp,
	})

	s := server.New(bindAddr, router)

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

func websocketHandler(w http.ResponseWriter, req *http.Request) {
	c, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.ErrorR(req, err, nil)
		return
	}

	defer c.Close()

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
			writeToDB(e)
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

func writeToDB(e florenceLogEvent) {
	e.Created = time.Now()

	if session == nil {
		log.Debug("FLORENCE LOG EVENT!", log.Data{"event": e})
		return
	}

	s := session.New()
	defer s.Close()
	if err := s.DB("florence").C("client_log").Insert(&e); err != nil {
		log.Error(err, log.Data{"event": e})
	}
}
