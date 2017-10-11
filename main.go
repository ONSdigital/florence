package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"mime"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	mgo "gopkg.in/mgo.v2"

	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/healthcheck"
	"github.com/ONSdigital/florence/upload"
	"github.com/ONSdigital/go-ns/handlers/reverseProxy"
	hc "github.com/ONSdigital/go-ns/healthcheck"
	"github.com/ONSdigital/go-ns/log"
	"github.com/ONSdigital/go-ns/server"
	"github.com/gorilla/pat"
	"github.com/gorilla/websocket"
)

var bindAddr = ":8080"
var babbageURL = "http://localhost:20000"
var zebedeeURL = "http://localhost:8082"
var recipeAPIURL = "http://localhost:22300"
var importAPIURL = "http://localhost:21800"
var datasetAPIURL = "http://localhost:22000"
var uploadBucketName = "dp-frontend-florence-file-uploads"
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
	if v := os.Getenv("RECIPE_API_URL"); len(v) > 0 {
		recipeAPIURL = v
	}
	if v := os.Getenv("UPLOAD_BUCKET_NAME"); len(v) > 0 {
		uploadBucketName = v
	}
	if v := os.Getenv("IMPORT_API_URL"); len(v) > 0 {
		importAPIURL = v
	}
	if v := os.Getenv("DATASET_API_URL"); len(v) > 0 {
		datasetAPIURL = v
	}
	if v := os.Getenv("ENABLE_NEW_APP"); len(v) > 0 {
		enableNewApp, _ = strconv.ParseBool(v)
	}

	log.Namespace = "florence"

	zc := healthcheck.New(zebedeeURL, "zebedee")
	bc := healthcheck.New(babbageURL, "babbage")
	dc := healthcheck.New(datasetAPIURL, "dataset-api")
	rc := healthcheck.New(recipeAPIURL, "recipe-api")
	ic := healthcheck.New(importAPIURL, "import-api")

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

	recipeAPIURL, err := url.Parse(recipeAPIURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	recipeAPIProxy := reverseProxy.Create(recipeAPIURL, nil)

	importAPIURL, err := url.Parse(importAPIURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	importAPIProxy := reverseProxy.Create(importAPIURL, importAPIDirector)

	datasetAPIURL, err := url.Parse(datasetAPIURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	datasetAPIProxy := reverseProxy.Create(datasetAPIURL, datasetAPIDirector)

	router := pat.New()

	newAppHandler := refactoredIndexFile

	if !enableNewApp {
		newAppHandler = legacyIndexFile
	}

	uploader, err := upload.New(uploadBucketName)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	router.Path("/healthcheck").HandlerFunc(hc.Do)

	router.Path("/upload").Methods("GET").HandlerFunc(uploader.CheckUploaded)
	router.Path("/upload").Methods("POST").HandlerFunc(uploader.Upload)
	router.Path("/upload/{id}").Methods("GET").HandlerFunc(uploader.GetS3URL)

	router.Handle("/zebedee{uri:/.*}", zebedeeProxy)
	router.Handle("/recipes{uri:.*}", recipeAPIProxy)
	router.Handle("/import{uri:.*}", importAPIProxy)
	router.Handle("/dataset/{uri:.*}", datasetAPIProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence", legacyIndexFile)
	router.HandleFunc("/florence/", redirectToFlorence)
	router.HandleFunc("/florence/index.html", redirectToFlorence)
	router.HandleFunc("/florence/collections", legacyIndexFile)
	router.HandleFunc("/florence/publishing-queue", legacyIndexFile)
	router.HandleFunc("/florence/reports", legacyIndexFile)
	router.HandleFunc("/florence/users-and-access", legacyIndexFile)
	router.HandleFunc("/florence/websocket", websocketHandler)
	router.HandleFunc("/florence{uri:/.*}", newAppHandler)
	router.Handle("/{uri:.*}", babbageProxy)

	log.Debug("Starting server", log.Data{
		"bind_addr":       bindAddr,
		"babbage_url":     babbageURL,
		"zebedee_url":     zebedeeURL,
		"recipe_api_url":  recipeAPIURL,
		"import_api_url":  importAPIURL,
		"dataset_api_url": datasetAPIURL,
		"enable_new_app":  enableNewApp,
	})

	s := server.New(bindAddr, router)
	// TODO need to reconsider default go-ns server timeouts
	s.Server.IdleTimeout = 120 * time.Second
	s.Server.WriteTimeout = 120 * time.Second
	s.Server.ReadTimeout = 30 * time.Second
	s.HandleOSSignals = false
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

	go func() {
		if err := s.ListenAndServe(); err != nil {
			log.Error(err, nil)
			os.Exit(2)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, os.Kill)

	for {
		hc.MonitorExternal(bc, zc, ic, rc, dc)

		timer := time.NewTimer(time.Second * 60)

		select {
		case <-timer.C:
			continue
		case <-stop:
			log.Info("shutting service down gracefully", nil)
			timer.Stop()
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()
			if err := s.Server.Shutdown(ctx); err != nil {
				log.Error(err, nil)
			}
			return
		}
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

func importAPIDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/import")
}

func datasetAPIDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/dataset")
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
