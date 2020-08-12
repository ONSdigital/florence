package service

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
	"time"

	"github.com/ONSdigital/dp-api-clients-go/headers"
	"github.com/ONSdigital/dp-api-clients-go/health"
	"github.com/ONSdigital/dp-net/handlers/reverseproxy"
	dprequest "github.com/ONSdigital/dp-net/request"
	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/upload"
	"github.com/ONSdigital/log.go/log"
	"github.com/gorilla/pat"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
)

// generated files constants
const (
	assetStaticRoot  = "../dist/"
	assetLegacyIndex = "../dist/legacy-assets/index.html"
	assetRefactored  = "../dist/refactored.html"
)

var getAsset = assets.Asset
var getAssetETag = assets.GetAssetETag
var upgrader = websocket.Upgrader{}

// Service contains all the configs, server and clients to run the Image API
type Service struct {
	version      string
	config       *config.Config
	vaultClient  upload.VaultClient
	s3Client     upload.S3Client
	uploader     *upload.Uploader
	healthClient *health.Client
	healthCheck  HealthChecker
	router       *pat.Router
	server       HTTPServer
	serviceList  *ExternalServiceList
}

// Run the service
func Run(ctx context.Context, cfg *config.Config, serviceList *ExternalServiceList, buildTime, gitCommit, version string, svcErrors chan error) (svc *Service, err error) {

	log.Event(ctx, "running service", log.INFO)
	svc = &Service{
		version:     version,
		config:      cfg,
		serviceList: serviceList,
	}

	// Create Vault client (and add Check) if encryption is enabled
	if !cfg.EncryptionDisabled {
		svc.vaultClient, err = serviceList.GetVault(cfg)
		if err != nil {
			log.Event(ctx, "error creating vault client", log.FATAL, log.Error(err))
			return nil, err
		}
	}

	// Create S3 Client with region and bucket name
	svc.s3Client, err = serviceList.GetS3Client(cfg)
	if err != nil {
		log.Event(ctx, "error creating S3 client", log.FATAL, log.Error(err))
		return nil, err
	}

	// Create Uploader with S3 client and Vault
	svc.uploader = upload.New(svc.s3Client, svc.vaultClient, cfg.VaultPath, cfg.AwsRegion, cfg.UploadBucketName)

	// Get health client for api router
	svc.healthClient = serviceList.GetHealthClient("api-router", cfg.APIRouterURL)

	// Get healthcheck
	svc.healthCheck, err = serviceList.GetHealthCheck(cfg, buildTime, gitCommit, version)
	if err != nil {
		log.Event(ctx, "failed to create health check", log.FATAL, log.Error(err))
		return nil, err
	}
	if err := svc.registerCheckers(ctx, cfg); err != nil {
		return nil, errors.Wrap(err, "unable to register checkers")
	}

	svc.router, err = svc.createRouter(ctx, cfg)
	if err != nil {
		return nil, err
	}
	svc.server = serviceList.GetHTTPServer(cfg.BindAddr, svc.router)

	// // FIXME temporary hack to remove timeout middleware (doesn't support hijacker interface)
	// mo := s.MiddlewareOrder
	// var newMo []string
	// for _, mw := range mo {
	// 	if mw != "Timeout" {
	// 		newMo = append(newMo, mw)
	// 	}
	// }
	// s.MiddlewareOrder = newMo

	svc.healthCheck.Start(ctx)

	go func() {
		if err := svc.server.ListenAndServe(); err != nil {
			svcErrors <- errors.Wrap(err, "failure in http listen and serve")
		}
	}()

	return svc, nil
}

// createRouter creates a Router with the necessary reverse proxies for services that florence needs to call,
// and handlers for the S3 Uploader and legacy index files.
// CMD API calls (recipe, import and dataset APIs) are proxied through the API router.
func (svc *Service) createRouter(ctx context.Context, cfg *config.Config) (router *pat.Router, err error) {

	apiRouterURL, err := url.Parse(cfg.APIRouterURL)
	if err != nil {
		log.Event(ctx, "error parsing API router URL", log.FATAL, log.Error(err))
		return nil, err
	}

	routerURL, err := url.Parse(cfg.RouterURL)
	if err != nil {
		log.Event(ctx, "error parsing frontend router URL", log.FATAL, log.Error(err))
		return nil, err
	}

	zebedeeURL, err := url.Parse(cfg.ZebedeeURL)
	if err != nil {
		log.Event(ctx, "error parsing zebedee URL", log.FATAL, log.Error(err))
		return nil, err
	}

	tableURL, err := url.Parse(cfg.TableRendererURL)
	if err != nil {
		log.Event(ctx, "error parsing table renderer URL", log.FATAL, log.Error(err))
		return nil, err
	}

	datasetControllerURL, err := url.Parse(cfg.DatasetControllerURL)
	if err != nil {
		log.Event(ctx, "error parsing dataset controller URL", log.FATAL, log.Error(err))
		return nil, err
	}

	routerProxy := reverseproxy.Create(routerURL, director)
	zebedeeProxy := reverseproxy.Create(zebedeeURL, zebedeeDirector)
	recipeAPIProxy := reverseproxy.Create(apiRouterURL, recipeAPIDirector(cfg.APIRouterVersion))
	tableProxy := reverseproxy.Create(tableURL, tableDirector)
	importAPIProxy := reverseproxy.Create(apiRouterURL, importAPIDirector(cfg.APIRouterVersion))
	datasetAPIProxy := reverseproxy.Create(apiRouterURL, datasetAPIDirector(cfg.APIRouterVersion))
	datasetControllerProxy := reverseproxy.Create(datasetControllerURL, datasetControllerDirector)

	router = pat.New()

	router.HandleFunc("/health", svc.healthCheck.Handler)

	if cfg.SharedConfig.EnableDatasetImport {
		router.Path("/upload").Methods("GET").HandlerFunc(svc.uploader.CheckUploaded)
		router.Path("/upload").Methods("POST").HandlerFunc(svc.uploader.Upload)
		router.Path("/upload/{id}").Methods("GET").HandlerFunc(svc.uploader.GetS3URL)
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
	router.HandleFunc("/florence/websocket", svc.websocketHandler)
	router.Path("/florence{uri:.*}").HandlerFunc(refactoredIndexFile(cfg))
	router.Handle("/{uri:.*}", routerProxy)

	return router, nil
}

// Close gracefully shuts the service down in the required order, with timeout
func (svc *Service) Close(ctx context.Context) error {
	timeout := svc.config.GracefulShutdownTimeout
	log.Event(ctx, "commencing graceful shutdown", log.Data{"graceful_shutdown_timeout": timeout}, log.INFO)
	ctx, cancel := context.WithTimeout(ctx, timeout)

	// track shutown gracefully closes up
	var gracefulShutdown bool

	go func() {
		defer cancel()
		var hasShutdownError bool

		// stop healthcheck, as it depends on everything else
		if svc.serviceList.HealthCheck {
			svc.healthCheck.Stop()
		}

		// stop any incoming requests before closing any outbound connections
		if err := svc.server.Shutdown(ctx); err != nil {
			log.Event(ctx, "failed to shutdown http server", log.Error(err), log.ERROR)
			hasShutdownError = true
		}

		if !hasShutdownError {
			gracefulShutdown = true
		}
	}()

	// wait for shutdown success (via cancel) or failure (timeout)
	<-ctx.Done()

	if !gracefulShutdown {
		err := errors.New("failed to shutdown gracefully")
		log.Event(ctx, "failed to shutdown gracefully ", log.ERROR, log.Error(err))
		return err
	}

	log.Event(ctx, "graceful shutdown was successful", log.INFO)
	return nil
}

func (svc *Service) registerCheckers(ctx context.Context, cfg *config.Config) (err error) {

	hasErrors := false

	if err = svc.healthCheck.AddCheck("S3", svc.s3Client.Checker); err != nil {
		hasErrors = true
		log.Event(ctx, "error adding check for s3 client", log.ERROR, log.Error(err))
	}

	if err = svc.healthCheck.AddCheck("API Router", svc.healthClient.Checker); err != nil {
		hasErrors = true
		log.Event(ctx, "error adding check for api router health client", log.ERROR, log.Error(err))
	}

	if !cfg.EncryptionDisabled {
		if err = svc.healthCheck.AddCheck("Vault", svc.vaultClient.Checker); err != nil {
			hasErrors = true
			log.Event(ctx, "error adding check for vault", log.ERROR, log.Error(err))
		}
	}

	if hasErrors {
		return errors.New("Error(s) registering checkers for healthcheck")
	}
	return nil
}

func redirectToFlorence(w http.ResponseWriter, req *http.Request) {
	http.Redirect(w, req, "/florence", 301)
}

func staticFiles(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":uri")
	assetPath := assetStaticRoot + path

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

		b, err := getAsset(assetLegacyIndex)
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

func director(req *http.Request) {
	if accessTokenCookie, err := req.Cookie(dprequest.FlorenceCookieKey); err == nil && len(accessTokenCookie.Value) > 0 {
		headers.SetUserAuthToken(req, accessTokenCookie.Value)
	}

	if colletionCookie, err := req.Cookie(dprequest.CollectionIDCookieKey); err == nil && len(colletionCookie.Value) > 0 {
		headers.SetCollectionID(req, colletionCookie.Value)
	}
}

func zebedeeDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/zebedee")
}

func recipeAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, req.URL.Path)
	}
}

func importAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, strings.TrimPrefix(req.URL.Path, "/import"))
	}
}

func datasetAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, strings.TrimPrefix(req.URL.Path, "/dataset"))
	}
}

func datasetControllerDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/dataset-controller")
}

func tableDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/table")
}

func (svc *Service) websocketHandler(w http.ResponseWriter, req *http.Request) {
	c, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Event(req.Context(), "error upgrading connection to websocket", log.ERROR, log.Error(err))
		return
	}

	defer c.Close()

	err = c.WriteJSON(florenceServerEvent{"version", florenceVersionPayload{Version: svc.version}})
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

func refactoredIndexFile(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Event(req.Context(), "getting refactored html file", log.INFO)

		b, err := getAsset(assetRefactored)
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
