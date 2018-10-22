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
	"strings"
	"time"

	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/healthcheck"
	"github.com/ONSdigital/florence/upload"
	"github.com/ONSdigital/go-ns/handlers/reverseProxy"
	hc "github.com/ONSdigital/go-ns/healthcheck"
	"github.com/ONSdigital/go-ns/log"
	"github.com/ONSdigital/go-ns/server"
	"github.com/ONSdigital/go-ns/vault"
	"github.com/gorilla/pat"
	"github.com/gorilla/websocket"
)

var getAsset = assets.Asset
var getAssetETag = assets.GetAssetETag
var upgrader = websocket.Upgrader{}

// Version is set by the make target
var Version string

func main() {
	log.Debug("florence version", log.Data{"version": Version})

	cfg, err := config.Get()
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	log.Namespace = "florence"

	zc := healthcheck.New(cfg.ZebedeeURL, "zebedee")
	rtrc := healthcheck.New(cfg.RouterURL, "router")
	dc := healthcheck.New(cfg.DatasetAPIURL, "dataset-api")
	rc := healthcheck.New(cfg.RecipeAPIURL, "recipe-api")
	ic := healthcheck.New(cfg.ImportAPIURL, "import-api")

	/*
		NOTE:
		If there's any issues with this Florence server proxying redirects
		from either Babbage or Zebedee then the code in the previous Java
		Florence server might give some clues for a solution: https://github.com/ONSdigital/florence/blob/b13df0708b30493b98e9ce239103c59d7f409f98/src/main/java/com/github/onsdigital/florence/filter/Proxy.java#L125-L135

		The code has purposefully not been included in this Go replacement
		because we can't see what issue it's fixing and whether it's necessary.
	*/

	routerURL, err := url.Parse(cfg.RouterURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	routerProxy := reverseProxy.Create(routerURL, frontendRouterDirector)

	zebedeeURL, err := url.Parse(cfg.ZebedeeURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	zebedeeProxy := reverseProxy.Create(zebedeeURL, zebedeeDirector)

	recipeAPIURL, err := url.Parse(cfg.RecipeAPIURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	recipeAPIProxy := reverseProxy.Create(recipeAPIURL, recipeAPIDirector)

	tableURL, err := url.Parse(cfg.TableRendererURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	tableProxy := reverseProxy.Create(tableURL, tableDirector)

	importAPIURL, err := url.Parse(cfg.ImportAPIURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	importAPIProxy := reverseProxy.Create(importAPIURL, importAPIDirector)

	datasetAPIURL, err := url.Parse(cfg.DatasetAPIURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	datasetAPIProxy := reverseProxy.Create(datasetAPIURL, datasetAPIDirector)

	router := pat.New()

	var vc upload.VaultClient
	if !cfg.EncryptionDisabled {
		vc, err = vault.CreateVaultClient(cfg.VaultToken, cfg.VaultAddr, 3)
		if err != nil {
			log.Error(err, nil)
			os.Exit(1)
		}
	}

	uploader, err := upload.New(cfg.UploadBucketName, cfg.VaultPath, vc)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}

	router.Path("/healthcheck").HandlerFunc(hc.Do)

	if cfg.SharedConfig.EnableDatasetImport {
		router.Path("/upload").Methods("GET").HandlerFunc(uploader.CheckUploaded)
		router.Path("/upload").Methods("POST").HandlerFunc(uploader.Upload)
		router.Path("/upload/{id}").Methods("GET").HandlerFunc(uploader.GetS3URL)
		router.Handle("/recipes{uri:.*}", recipeAPIProxy)
		router.Handle("/import{uri:.*}", importAPIProxy)
		router.Handle("/dataset/{uri:.*}", datasetAPIProxy)
		router.Handle("/instances/{uri:.*}", datasetAPIProxy)
	}

	router.Handle("/zebedee{uri:/.*}", zebedeeProxy)
	router.Handle("/table/{uri:.*}", tableProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence/", redirectToFlorence)
	router.HandleFunc("/florence/index.html", redirectToFlorence)
	router.Path("/florence/publishing-queue").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/reports").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/users-and-access").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/workspace").HandlerFunc(legacyIndexFile(cfg))
	router.HandleFunc("/florence/websocket", websocketHandler)
	router.Path("/florence{uri:.*}").HandlerFunc(refactoredIndexFile(cfg))
	router.Handle("/{uri:.*}", routerProxy)

	log.Debug("Starting server", log.Data{"config": cfg})

	s := server.New(cfg.BindAddr, router)
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
		hc.MonitorExternal(rtrc, zc, ic, rc, dc)

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

func legacyIndexFile(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Debug("Getting legacy HTML file", nil)

		b, err := getAsset("../dist/legacy-assets/index.html")
		if err != nil {
			log.Error(err, nil)
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Error(err, log.Data{"message": "error marshalling shared configuration struct"})
			w.WriteHeader(500)
			return
		}
		b = []byte(strings.Replace(string(b), "/* environment variables placeholder */", "/* server generated shared config */ "+string(cfgJSON), 1))

		w.Header().Set(`Content-Type`, "text/html")
		w.WriteHeader(200)
		w.Write(b)
	}
}

func refactoredIndexFile(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Debug("Getting refactored HTML file", nil)

		b, err := getAsset("../dist/refactored.html")
		if err != nil {
			log.Error(err, nil)
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Error(err, log.Data{"message": "error marshalling shared configuration struct"})
			w.WriteHeader(500)
			return
		}
		b = []byte(strings.Replace(string(b), "/* environment variables placeholder */", "/* server generated shared config */ "+string(cfgJSON), 1))

		w.Header().Set(`Content-Type`, "text/html")
		w.WriteHeader(200)
		w.Write(b)
	}
}

func zebedeeDirector(req *http.Request) {
	log.DebugR(req, "Proxying request", log.Data{
		"destination": req.URL,
		"proxy_name":  "zebedee",
	})
	if c, err := req.Cookie(`access_token`); err == nil && len(c.Value) > 0 {
		req.Header.Set(`X-Florence-Token`, c.Value)
	}
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/zebedee")
}

func director(req *http.Request) {
	if c, err := req.Cookie(`access_token`); err == nil && len(c.Value) > 0 {
		req.Header.Set(`X-Florence-Token`, c.Value)
	}
}

func importAPIDirector(req *http.Request) {
	log.DebugR(req, "Proxying request", log.Data{
		"destination": req.URL,
		"proxy_name":  "import-data",
	})
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/import")
}

func recipeAPIDirector(req *http.Request) {
	log.DebugR(req, "Proxying request", log.Data{
		"destination": req.URL,
		"proxy_name":  "recipe-api",
	})
}

func tableDirector(req *http.Request) {
	log.DebugR(req, "Proxying request", log.Data{
		"destination": req.URL,
		"proxy_name":  "table-builder",
	})
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/table")
}

func frontendRouterDirector(req *http.Request) {
	log.DebugR(req, "Proxying request", log.Data{
		"destination": req.URL,
		"proxy_name":  "frontend-router",
	})
	director(req)
}

func datasetAPIDirector(req *http.Request) {
	log.DebugR(req, "Proxying request", log.Data{
		"destination": req.URL,
		"proxy_name":  "dataset-api",
	})
	director(req)
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
