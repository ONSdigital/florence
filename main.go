package main

import (
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
	"github.com/ONSdigital/go-ns/handlers/timeout"
	"github.com/ONSdigital/go-ns/log"
	"github.com/ONSdigital/go-ns/server"
	"github.com/gorilla/pat"
)

var bindAddr = ":8080"
var babbageURL = "http://localhost:8080"
var zebedeeURL = "http://localhost:8082"
var enableNewApp = false
var timeoutSeconds = 30

var getAsset = assets.Asset

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
	if v := os.Getenv("TIMEOUT"); len(v) > 0 {
		var err error
		if timeoutSeconds, err = strconv.Atoi(v); err != nil {
			log.Error(err, nil)
			os.Exit(1)
		}
		if timeoutSeconds > 120 {
			log.Debug("timeout too high, setting to 120s", log.Data{"timeout": timeoutSeconds})
			timeoutSeconds = 120
		} else if timeoutSeconds < 0 {
			log.Debug("timeout too low, setting to 10s", log.Data{"timeout": timeoutSeconds})
			timeoutSeconds = 10
		}
		log.Debug("setting HTTP timeout", log.Data{"timeout": timeoutSeconds})
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
	router.HandleFunc("/florence", newAppHandler)
	router.HandleFunc("/florence/index.html", legacyIndexFile)
	router.HandleFunc("/florence{uri:|/.*}", newAppHandler)
	router.Handle("/{uri:.*}", babbageProxy)

	log.Debug("Starting server", log.Data{
		"bind_addr":      bindAddr,
		"babbage_url":    babbageURL,
		"zebedee_url":    zebedeeURL,
		"enable_new_app": enableNewApp,
	})

	s := server.New(bindAddr, router)
	s.Middleware["Timeout"] = timeout.Handler(time.Second * time.Duration(timeoutSeconds))

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
