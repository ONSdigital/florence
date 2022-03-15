package service

import (
	"context"
	"net/url"

	"github.com/ONSdigital/florence/service/modifiers"

	"github.com/ONSdigital/dp-api-clients-go/v2/health"
	"github.com/ONSdigital/dp-net/v2/handlers/reverseproxy"
	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/log.go/log"
	"github.com/gorilla/pat"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
)

var (
	getAsset     = assets.Asset
	getAssetETag = assets.GetAssetETag
	upgrader     = websocket.Upgrader{}
)

// Service contains all the configs, server and clients to run Florence
type Service struct {
	version      string
	Config       *config.Config
	healthClient *health.Client
	HealthCheck  HealthChecker
	Router       *pat.Router
	Server       HTTPServer
	ServiceList  *ExternalServiceList
}

// Run the service
func Run(ctx context.Context, cfg *config.Config, serviceList *ExternalServiceList, buildTime, gitCommit, version string, svcErrors chan error) (svc *Service, err error) {

	log.Event(ctx, "running service", log.INFO)

	// Initialise Service struct
	svc = &Service{
		version:     version,
		Config:      cfg,
		ServiceList: serviceList,
	}

	// Get health client for api router
	svc.healthClient = serviceList.GetHealthClient("api-router", cfg.APIRouterURL)

	// Get healthcheck with checkers
	svc.HealthCheck, err = serviceList.GetHealthCheck(cfg, buildTime, gitCommit, version)
	if err != nil {
		log.Event(ctx, "failed to create health check", log.FATAL, log.Error(err))
		return nil, err
	}
	if err := svc.registerCheckers(ctx, cfg); err != nil {
		return nil, errors.Wrap(err, "unable to register checkers")
	}

	// Create Router and HTTP Server
	svc.Router, err = svc.createRouter(ctx, cfg)
	if err != nil {
		return nil, err
	}
	svc.Server = serviceList.GetHTTPServer(cfg.BindAddr, svc.Router)

	// Start Healthcheck and HTTP Server
	svc.HealthCheck.Start(ctx)
	go func() {
		if err := svc.Server.ListenAndServe(); err != nil {
			svcErrors <- errors.Wrap(err, "failure in http listen and serve")
		}
	}()

	return svc, nil
}

// createRouter creates a Router with the necessary reverse proxies for services that florence needs to call,
// and handlers legacy index files.
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

	routerProxy := reverseproxy.Create(routerURL, director, nil)
	zebedeeProxy := reverseproxy.Create(apiRouterURL, zebedeeDirector, nil)
	interactivesProxy := reverseproxy.Create(apiRouterURL, interactivesDirector, nil)
	recipeAPIProxy := reverseproxy.Create(apiRouterURL, recipeAPIDirector(cfg.APIRouterVersion), nil)
	tableProxy := reverseproxy.Create(tableURL, tableDirector, nil)
	importAPIProxy := reverseproxy.Create(apiRouterURL, importAPIDirector(cfg.APIRouterVersion), nil)
	datasetAPIProxy := reverseproxy.Create(apiRouterURL, datasetAPIDirector(cfg.APIRouterVersion), nil)
	datasetControllerProxy := reverseproxy.Create(datasetControllerURL, datasetControllerDirector, nil)
	topicsProxy := reverseproxy.Create(apiRouterURL, topicAPIDirector(cfg.APIRouterVersion), nil)
	imageAPIProxy := reverseproxy.Create(apiRouterURL, imageAPIDirector(cfg.APIRouterVersion), nil)
	uploadServiceAPIProxy := reverseproxy.Create(apiRouterURL, uploadServiceAPIDirector(cfg.APIRouterVersion), nil)
	identityAPIProxy := reverseproxy.Create(apiRouterURL, identityAPIDirector(cfg.APIRouterVersion), modifiers.IdentityResponseModifier)

	router = pat.New()

	router.HandleFunc("/health", svc.HealthCheck.Handler)

	router.Handle("/upload", uploadServiceAPIProxy)
	router.Handle("/upload/{id}", uploadServiceAPIProxy)

	if cfg.SharedConfig.EnableDatasetImport {
		router.Handle("/recipes{uri:.*}", recipeAPIProxy)
		router.Handle("/import{uri:.*}", importAPIProxy)
		router.Handle("/dataset/{uri:.*}", datasetAPIProxy)
		router.Handle("/instances/{uri:.*}", datasetAPIProxy)
		router.Handle("/dataset-controller/{uri:.*}", datasetControllerProxy)
	}
	if cfg.SharedConfig.EnableNewSignIn {
		router.Handle("/tokens", identityAPIProxy)
		router.Handle("/tokens/{uri:.*}", identityAPIProxy)
		router.Handle("/users", identityAPIProxy)
		router.Handle("/users/{uri:.*}", identityAPIProxy)
		router.Handle("/groups/{uri:.*}", identityAPIProxy)
		router.Handle("/groups", identityAPIProxy)
		router.Handle("/password-reset", identityAPIProxy)
		router.Handle("/password-reset/{uri:.*}", identityAPIProxy)
	}
	router.Handle("/image/{uri:.*}", imageAPIProxy)
	router.Handle("/zebedee{uri:/.*}", zebedeeProxy)
	router.Handle("/interactives{uri:/.*}", interactivesProxy)
	router.Handle("/table/{uri:.*}", tableProxy)
	router.Handle("/topics", topicsProxy)
	router.Handle("/topics/{uri:.*}", topicsProxy)
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence/", redirectToFlorence)
	router.HandleFunc("/florence/index.html", redirectToFlorence)
	router.Path("/florence/publishing-queue").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/reports").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/workspace").HandlerFunc(legacyIndexFile(cfg))
	router.HandleFunc("/florence/websocket", websocketHandler(svc.version))
	router.Path("/florence{uri:.*}").HandlerFunc(refactoredIndexFile(cfg))
	router.Handle("/{uri:.*}", routerProxy)

	return router, nil
}

// Close gracefully shuts the service down in the required order, with timeout
func (svc *Service) Close(ctx context.Context) error {
	timeout := svc.Config.GracefulShutdownTimeout
	log.Event(ctx, "commencing graceful shutdown", log.Data{"graceful_shutdown_timeout": timeout}, log.INFO)
	ctx, cancel := context.WithTimeout(ctx, timeout)
	hasShutdownError := false

	go func() {
		defer cancel()

		// stop healthcheck, as it depends on everything else
		if svc.ServiceList.HealthCheck {
			svc.HealthCheck.Stop()
		}

		// stop any incoming requests
		if err := svc.Server.Shutdown(ctx); err != nil {
			log.Event(ctx, "failed to shutdown http server", log.Error(err), log.ERROR)
			hasShutdownError = true
		}
	}()

	// wait for shutdown success (via cancel) or failure (timeout)
	<-ctx.Done()

	// timeout expired
	if ctx.Err() == context.DeadlineExceeded {
		log.Event(ctx, "shutdown timed out", log.ERROR, log.Error(ctx.Err()))
		return ctx.Err()
	}

	// other error
	if hasShutdownError {
		err := errors.New("failed to shutdown gracefully")
		log.Event(ctx, "failed to shutdown gracefully ", log.ERROR, log.Error(err))
		return err
	}

	log.Event(ctx, "graceful shutdown was successful", log.INFO)
	return nil
}

func (svc *Service) registerCheckers(ctx context.Context, cfg *config.Config) (err error) {

	hasErrors := false

	if err = svc.HealthCheck.AddCheck("API router", svc.healthClient.Checker); err != nil {
		hasErrors = true
		log.Event(ctx, "error adding check for api router health client", log.ERROR, log.Error(err))
	}

	if hasErrors {
		return errors.New("Error(s) registering checkers for healthcheck")
	}
	return nil
}
