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
	"github.com/ONSdigital/go-ns/common"
	"github.com/ONSdigital/go-ns/handlers/reverseProxy"
	hc "github.com/ONSdigital/go-ns/healthcheck"
	"github.com/ONSdigital/go-ns/server"
	"github.com/ONSdigital/go-ns/vault"
	"github.com/ONSdigital/log.go/log"
	"github.com/gorilla/pat"
	"github.com/gorilla/websocket"
)

var getAsset = assets.Asset
var getAssetETag = assets.GetAssetETag
var upgrader = websocket.Upgrader{}

// Version is set by the make target
var Version string

func main() {
	log.Namespace = "florence"
	log.Event(nil, "florence version", log.Data{"version": Version})

	cfg, err := config.Get()
	if err != nil {
		log.Event(nil, "error getting configuration", log.Error(err))
		os.Exit(1)
	}

	zc := healthcheck.New(cfg.ZebedeeURL, "zebedee")
	rtrc := healthcheck.New(cfg.RouterURL, "router")
	dc := healthcheck.New(cfg.DatasetAPIURL, "dataset-api")
	rc := healthcheck.New(cfg.RecipeAPIURL, "recipe-api")
	ic := healthcheck.New(cfg.ImportAPIURL, "import-api")

	routerURL, err := url.Parse(cfg.RouterURL)
	if err != nil {
		log.Event(nil, "error parsing router URL", log.Error(err))
		os.Exit(1)
	}
	routerProxy := reverseProxy.Create(routerURL, director)

	zebedeeURL, err := url.Parse(cfg.ZebedeeURL)
	if err != nil {
		log.Event(nil, "error parsing zebedee URL", log.Error(err))
		os.Exit(1)
	}
	zebedeeProxy := reverseProxy.Create(zebedeeURL, zebedeeDirector)

	recipeAPIURL, err := url.Parse(cfg.RecipeAPIURL)
	if err != nil {
		log.Event(nil, "error parsing recipe API URL", log.Error(err))
		os.Exit(1)
	}
	recipeAPIProxy := reverseProxy.Create(recipeAPIURL, nil)

	tableURL, err := url.Parse(cfg.TableRendererURL)
	if err != nil {
		log.Event(nil, "error parsing table renderer URL", log.Error(err))
		os.Exit(1)
	}
	tableProxy := reverseProxy.Create(tableURL, tableDirector)

	importAPIURL, err := url.Parse(cfg.ImportAPIURL)
	if err != nil {
		log.Event(nil, "error parsing import API URL", log.Error(err))
		os.Exit(1)
	}
	importAPIProxy := reverseProxy.Create(importAPIURL, importAPIDirector)

	datasetAPIURL, err := url.Parse(cfg.DatasetAPIURL)
	if err != nil {
		log.Event(nil, "error parsing dataset API URL", log.Error(err))
		os.Exit(1)
	}
	datasetAPIProxy := reverseProxy.Create(datasetAPIURL, datasetAPIDirector)

	datasetControllerURL, err := url.Parse(cfg.DatasetAPIURL)
	if err != nil {
		log.Event(nil, "error parsing dataset controller URL", log.Error(err))
		os.Exit(1)
	}
	datasetControllerProxy := reverseProxy.Create(datasetControllerURL, datasetControllerDirector)

	var vc upload.VaultClient
	if !cfg.EncryptionDisabled {
		vc, err = vault.CreateVaultClient(cfg.VaultToken, cfg.VaultAddr, 3)
		if err != nil {
			log.Event(nil, "error creating vault client", log.Error(err))
			os.Exit(1)
		}
	}

	uploader, err := upload.New(cfg.UploadBucketName, cfg.VaultPath, vc)
	if err != nil {
		log.Event(nil, "error creating file uploader", log.Error(err))
		os.Exit(1)
	}

	router := pat.New()

	router.Path("/healthcheck").HandlerFunc(hc.Do)

	if cfg.SharedConfig.EnableDatasetImport {
		router.Path("/upload").Methods("GET").HandlerFunc(uploader.CheckUploaded)
		router.Path("/upload").Methods("POST").HandlerFunc(uploader.Upload)
		router.Path("/upload/{id}").Methods("GET").HandlerFunc(uploader.GetS3URL)
		router.Handle("/recipes{uri:.*}", recipeAPIProxy)
		router.Handle("/import{uri:.*}", importAPIProxy)
		router.Handle("/dataset/{uri:.*}", datasetAPIProxy)
		router.Handle("/instances/{uri:.*}", datasetAPIProxy)
		router.Handle("/dataset-controller/{uri:.*}", datasetControllerProxy)
	}

	router.Handle("/zebedee{uri:/.*}", zebedeeProxy)
	router.Handle("/table/{uri:.*}", tableProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence/", redirectToFlorence)
	router.HandleFunc("/florence/index.html", redirectToFlorence)
	router.Path("/florence/publishing-queue").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/reports").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/workspace").HandlerFunc(legacyIndexFile(cfg))
	router.HandleFunc("/florence/websocket", websocketHandler)
	router.Path("/florence{uri:.*}").HandlerFunc(refactoredIndexFile(cfg))
	router.Handle("/{uri:.*}", routerProxy)

	log.Event(nil, "starting server", log.Data{"config": cfg})

	s := server.New(cfg.BindAddr, router)
	// TODO need to reconsider default go-ns server timeouts
	s.Server.IdleTimeout = 120 * time.Second
	s.Server.WriteTimeout = 120 * time.Second
	s.Server.ReadTimeout = 30 * time.Second
	s.HandleOSSignals = false
	s.Middleware["RequestLogger"] = log.Middleware
	s.MiddlewareOrder = []string{"RequestID", "RequestLogger"}

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
			log.Event(nil, "error starting http server", log.Error(err))
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
			log.Event(nil, "shutting down gracefully")
			timer.Stop()
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()
			if err := s.Server.Shutdown(ctx); err != nil {
				log.Event(nil, "error shutting down gracefully", log.Error(err))
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
		log.Event(req.Context(), "error getting asset", log.Error(err))
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
		log.Event(req.Context(), "getting legacy html file")

		b, err := getAsset("../dist/legacy-assets/index.html")
		if err != nil {
			log.Event(req.Context(), "error getting legacy html file", log.Error(err))
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Event(req.Context(), "error marshalling shared configuration", log.Error(err))
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
		log.Event(req.Context(), "getting refactored html file")

		b, err := getAsset("../dist/refactored.html")
		if err != nil {
			log.Event(req.Context(), "error getting refactored html file", log.Error(err))
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Event(req.Context(), "error marshalling shared configuration", log.Error(err))
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
	if c, err := req.Cookie(`access_token`); err == nil && len(c.Value) > 0 {
		req.Header.Set(`X-Florence-Token`, c.Value)
	}
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/zebedee")
}

func director(req *http.Request) {
	if accessTokenCookie, err := req.Cookie(common.FlorenceCookieKey); err == nil && len(accessTokenCookie.Value) > 0 {
		req.Header.Set(common.FlorenceHeaderKey, accessTokenCookie.Value)
	}

	if colletionCookie, err := req.Cookie(common.CollectionIDCookieKey); err == nil && len(colletionCookie.Value) > 0 {
		req.Header.Set(common.CollectionIDHeaderKey, colletionCookie.Value)
	}
}

func importAPIDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/import")
}

func tableDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/table")
}

func datasetAPIDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/dataset")
}

func datasetControllerDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/dataset-controller")
}

func websocketHandler(w http.ResponseWriter, req *http.Request) {
	c, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Event(req.Context(), "error upgrading connection to websocket", log.Error(err))
		return
	}

	defer c.Close()

	err = c.WriteJSON(florenceServerEvent{"version", florenceVersionPayload{Version: Version}})
	if err != nil {
		log.Event(req.Context(), "error writing version message", log.Error(err))
		return
	}

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Event(req.Context(), "error reading websocket message", log.Error(err))
			break
		}

		rdr := bufio.NewReader(bytes.NewReader(message))
		b, err := rdr.ReadBytes('{')
		if err != nil {
			log.Event(req.Context(), "error reading websocket bytes", log.Error(err), log.Data{"bytes": string(b)})
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
				log.Event(req.Context(), "error unmarshalling websocket message", log.Error(err), log.Data{"data": string(eventData)})
				continue
			}
			log.Event(req.Context(), "client log", log.Data{"data": e})

			err = c.WriteJSON(florenceServerEvent{"ack", eventID})
			if err != nil {
				log.Event(req.Context(), "error writing websocket ack", log.Error(err))
			}
		default:
			log.Event(req.Context(), "unknown websocket event type", log.Data{"type": eventType, "data": string(eventData)})
		}
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
