package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/ONSdigital/dp-api-clients-go/headers"
	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	s3client "github.com/ONSdigital/dp-s3"
	vault "github.com/ONSdigital/dp-vault"
	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/upload"
	"github.com/ONSdigital/go-ns/common"
	"github.com/ONSdigital/go-ns/handlers/reverseProxy"
	"github.com/ONSdigital/go-ns/server"
	"github.com/ONSdigital/log.go/log"
	"github.com/gorilla/pat"
	"github.com/gorilla/websocket"
)

var getAsset = assets.Asset
var getAssetETag = assets.GetAssetETag
var upgrader = websocket.Upgrader{}

var (
	// BuildTime represents the time in which the service was built
	BuildTime string
	// GitCommit represents the commit (SHA-1) hash of the service that is running
	GitCommit string
	// Version represents the version of the service that is running
	Version string
)

func main() {
	log.Namespace = "florence"
	ctx := context.Background()

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	log.Event(ctx, "florence version", log.INFO, log.Data{"version": Version})

	cfg, err := config.Get()
	if err != nil {
		log.Event(ctx, "error getting configuration", log.FATAL, log.Error(err))
		os.Exit(1)
	}

	// Create healthcheck object with versionInfo
	versionInfo, err := healthcheck.NewVersionInfo(BuildTime, GitCommit, Version)
	if err != nil {
		log.Event(ctx, "failed to create service version information", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	hc := healthcheck.New(versionInfo, cfg.HealthCheckCriticalTimeout, cfg.HealthCheckInterval)

	routerURL, err := url.Parse(cfg.RouterURL)
	if err != nil {
		log.Event(ctx, "error parsing router URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	routerProxy := reverseProxy.Create(routerURL, director)

	zebedeeURL, err := url.Parse(cfg.ZebedeeURL)
	if err != nil {
		log.Event(ctx, "error parsing zebedee URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	zebedeeProxy := reverseProxy.Create(zebedeeURL, zebedeeDirector)

	recipeAPIURL, err := url.Parse(cfg.RecipeAPIURL)
	if err != nil {
		log.Event(ctx, "error parsing recipe API URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	recipeAPIProxy := reverseProxy.Create(recipeAPIURL, nil)

	tableURL, err := url.Parse(cfg.TableRendererURL)
	if err != nil {
		log.Event(ctx, "error parsing table renderer URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	tableProxy := reverseProxy.Create(tableURL, tableDirector)

	importAPIURL, err := url.Parse(cfg.ImportAPIURL)
	if err != nil {
		log.Event(ctx, "error parsing import API URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	importAPIProxy := reverseProxy.Create(importAPIURL, importAPIDirector)

	datasetAPIURL, err := url.Parse(cfg.DatasetAPIURL)
	if err != nil {
		log.Event(ctx, "error parsing dataset API URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	datasetAPIProxy := reverseProxy.Create(datasetAPIURL, datasetAPIDirector)

	datasetControllerURL, err := url.Parse(cfg.DatasetControllerURL)
	if err != nil {
		log.Event(ctx, "error parsing dataset controller URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	datasetControllerProxy := reverseProxy.Create(datasetControllerURL, datasetControllerDirector)

	imageAPIURL, err := url.Parse(cfg.ImageAPIURL)
	if err != nil {
		log.Event(ctx, "error parsing image API URL", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	imageAPIProxy := reverseProxy.Create(imageAPIURL, imageAPIDirector)

	// Create Vault client (and add Check) if encryption is enabled
	var vc upload.VaultClient
	if !cfg.EncryptionDisabled {
		vc, err = vault.CreateClient(cfg.VaultToken, cfg.VaultAddr, 3)
		if err != nil {
			log.Event(ctx, "error creating vault client", log.FATAL, log.Error(err))
			os.Exit(1)
		}
		if err = hc.AddCheck(vault.ServiceName, vc.Checker); err != nil {
			log.Event(ctx, "Failed to add Vault checker to healthcheck", log.FATAL, log.Error(err))
			os.Exit(1)
		}
	}

	// Create S3 Client with region and bucket name, and add Check
	s3, err := s3client.NewClient(cfg.AwsRegion, cfg.UploadBucketName, !cfg.EncryptionDisabled)
	if err != nil {
		log.Event(ctx, "error creating S3 client", log.FATAL, log.Error(err))
		os.Exit(1)
	}
	if err = hc.AddCheck(s3client.ServiceName, s3.Checker); err != nil {
		log.Event(ctx, "Failed to add S3 checker to healthcheck", log.FATAL, log.Error(err))
		os.Exit(1)
	}

	// Create Uploader with S3 client and Vault
	uploader := upload.New(s3, vc, cfg.VaultPath)

	router := pat.New()

	router.HandleFunc("/health", hc.Handler)

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
	router.Handle("/image/{uri:.*}", imageAPIProxy)
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

	log.Event(ctx, "starting server", log.INFO, log.Data{"config": cfg})

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

	hc.Start(ctx)

	go func() {
		if err := s.ListenAndServe(); err != nil {
			log.Event(ctx, "error starting http server", log.ERROR, log.Error(err))
			os.Exit(2)
		}
	}()

	// Block until a fatal error occurs
	select {
	case signal := <-signals:
		log.Event(ctx, "quitting after os signal received", log.INFO, log.Data{"signal": signal})
	}

	log.Event(ctx, fmt.Sprintf("shutdown with timeout: %s", cfg.GracefulShutdownTimeout), log.INFO)

	// give the app `Timeout` seconds to close gracefully before killing it.
	ctx, cancel := context.WithTimeout(context.Background(), cfg.GracefulShutdownTimeout)

	go func() {
		log.Event(ctx, "stop health checkers", log.INFO)
		hc.Stop()

		if err := s.Server.Shutdown(ctx); err != nil {
			log.Event(ctx, "failed to gracefully shutdown http server", log.ERROR, log.Error(err))
		}

		cancel() // stop timer
	}()

	// wait for timeout or success (via cancel)
	<-ctx.Done()
	if ctx.Err() == context.DeadlineExceeded {
		log.Event(ctx, "context deadline exceeded", log.WARN, log.Error(ctx.Err()))
	} else {
		log.Event(ctx, "graceful shutdown complete", log.INFO, log.Data{"context": ctx.Err()})
	}

	os.Exit(0)
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
		log.Event(req.Context(), "error getting asset", log.ERROR, log.Error(err))
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
		log.Event(req.Context(), "getting legacy html file", log.INFO)

		b, err := getAsset("../dist/legacy-assets/index.html")
		if err != nil {
			log.Event(req.Context(), "error getting legacy html file", log.ERROR, log.Error(err))
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Event(req.Context(), "error marshalling shared configuration", log.ERROR, log.Error(err))
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
		log.Event(req.Context(), "getting refactored html file", log.INFO)

		b, err := getAsset("../dist/refactored.html")
		if err != nil {
			log.Event(req.Context(), "error getting refactored html file", log.ERROR, log.Error(err))
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Event(req.Context(), "error marshalling shared configuration", log.ERROR, log.Error(err))
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
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/zebedee")
}

func director(req *http.Request) {
	if accessTokenCookie, err := req.Cookie(common.FlorenceCookieKey); err == nil && len(accessTokenCookie.Value) > 0 {
		headers.SetUserAuthToken(req, accessTokenCookie.Value)
	}

	if colletionCookie, err := req.Cookie(common.CollectionIDCookieKey); err == nil && len(colletionCookie.Value) > 0 {
		headers.SetCollectionID(req, colletionCookie.Value)
	}
}

func imageAPIDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/image")
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
		log.Event(req.Context(), "error upgrading connection to websocket", log.ERROR, log.Error(err))
		return
	}

	defer c.Close()

	err = c.WriteJSON(florenceServerEvent{"version", florenceVersionPayload{Version: Version}})
	if err != nil {
		log.Event(req.Context(), "error writing version message", log.ERROR, log.Error(err))
		return
	}

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Event(req.Context(), "error reading websocket message", log.ERROR, log.Error(err))
			break
		}

		rdr := bufio.NewReader(bytes.NewReader(message))
		b, err := rdr.ReadBytes('{')
		if err != nil {
			log.Event(req.Context(), "error reading websocket bytes", log.WARN, log.Error(err), log.Data{"bytes": string(b)})
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
				log.Event(req.Context(), "error unmarshalling websocket message", log.WARN, log.Error(err), log.Data{"data": string(eventData)})
				continue
			}
			log.Event(req.Context(), "client log", log.INFO, log.Data{"data": e})

			err = c.WriteJSON(florenceServerEvent{"ack", eventID})
			if err != nil {
				log.Event(req.Context(), "error writing websocket ack", log.WARN, log.Error(err))
			}
		default:
			log.Event(req.Context(), "unknown websocket event type", log.WARN, log.Data{"type": eventType, "data": string(eventData)})
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
