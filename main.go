package main

import (
	"math/rand"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/go-ns/handlers/reverseProxy"
	"github.com/ONSdigital/go-ns/log"
	"github.com/ONSdigital/go-ns/server"
	"github.com/gorilla/pat"
)

var getAsset = assets.Asset

func main() {
	log.Namespace = "florence"

	/*
		NOTE:
		If there's any issues with this Florence server proxying redirects
		from either Babbage or Zebedee then the code in the previous Java
		Florence server might give some clues for a solution: https://github.com/ONSdigital/florence/blob/b13df0708b30493b98e9ce239103c59d7f409f98/src/main/java/com/github/onsdigital/florence/filter/Proxy.java#L125-L135

		The code has purposefully not been included in this Go replacement
		because we can't see what issue it's fixing and whether it's necessary.
	*/

	babbageURL, err := url.Parse(config.BabbageURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	babbageProxy := reverseProxy.Create(babbageURL, nil)

	zebedeeURL, err := url.Parse(config.ZebedeeURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	zebedeeProxy := reverseProxy.Create(zebedeeURL, zebedeeDirector)

	router := pat.New()

	newAppHandler := refactoredIndexFile

	if !config.EnableNewApp {
		newAppHandler = legacyIndexFile
	}

	router.Handle("/zebedee/{uri:.*}", zebedeeProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence", newAppHandler)
	router.HandleFunc("/florence/index.html", legacyIndexFile)
	router.HandleFunc("/florence{uri:|/.*}", newAppHandler)
	router.Handle("/{uri:.*}", babbageProxy)

	log.Debug("Starting server", nil)
	s := server.New(config.BindAddr, router)

	if config.ChaosPanda.Enabled {
		s.Middleware["ChaosPanda"] = func(h http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
				if i := rand.Intn(100); i < config.ChaosPanda.InternalServerErrorRate {
					log.DebugR(req, "chaos monkey internal server error", log.Data{"rand": i})
					w.WriteHeader(500)
					w.Write([]byte(`Chaos Panda says no!`))
					return
				}
				if i := rand.Intn(100); i < config.ChaosPanda.ResponseDelayRate {
					ms := rand.Intn(config.ChaosPanda.ResponseDelayMaxMS)
					log.DebugR(req, "chaos monkey response delay", log.Data{"sleep": ms})
					time.Sleep(time.Duration(ms) * time.Millisecond)
				}
				h.ServeHTTP(w, req)
			})
		}
		s.MiddlewareOrder = append([]string{"ChaosPanda"}, s.MiddlewareOrder...)
	}

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
