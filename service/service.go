package service

import (
	"context"
	"net/url"

	"github.com/ONSdigital/dp-api-clients-go/v2/health"
	"github.com/ONSdigital/dp-net/v3/handlers/reverseproxy"
	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/directors"
	"github.com/ONSdigital/florence/service/modifiers"
	"github.com/ONSdigital/log.go/v2/log"
	"github.com/gorilla/mux"
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
	Router       *mux.Router
	Server       HTTPServer
	ServiceList  *ExternalServiceList
}

// Run the service
func Run(ctx context.Context, cfg *config.Config, serviceList *ExternalServiceList, buildTime, gitCommit, version string, svcErrors chan error) (svc *Service, err error) {
	log.Info(ctx, "running service")

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
		log.Error(ctx, "failed to create health check", err)
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
func (svc *Service) createRouter(ctx context.Context, cfg *config.Config) (router *mux.Router, err error) {
	apiRouterURL, err := url.Parse(cfg.APIRouterURL)
	if err != nil {
		log.Error(ctx, "error parsing API router URL", err)
		return nil, err
	}

	frontendRouterURL, err := url.Parse(cfg.FrontendRouterURL)
	if err != nil {
		log.Error(ctx, "error parsing frontend router URL", err)
		return nil, err
	}

	tableURL, err := url.Parse(cfg.TableRendererURL)
	if err != nil {
		log.Error(ctx, "error parsing table renderer URL", err)
		return nil, err
	}

	datasetControllerURL, err := url.Parse(cfg.DatasetControllerURL)
	if err != nil {
		log.Error(ctx, "error parsing dataset controller URL", err)
		return nil, err
	}

	dataAdminURL, err := url.Parse(cfg.DataAdminURL)
	if err != nil {
		log.Error(ctx, "error parsing data admin URL", err)
		return nil, err
	}

	frontendRouterProxy := reverseproxy.Create(frontendRouterURL, directors.Director(""), nil)
	apiRouterProxy := reverseproxy.Create(apiRouterURL, directors.Director("/api"), modifiers.IdentityResponseModifier(cfg.SharedConfig.APIRouterVersion))
	tableProxy := reverseproxy.Create(tableURL, directors.Director("/table"), nil)
	datasetControllerProxy := reverseproxy.Create(datasetControllerURL, directors.Director("/dataset-controller"), nil)
	dataAdminProxy := reverseproxy.Create(dataAdminURL, directors.Director("/data-admin"), nil)

	router = mux.NewRouter()

	router.HandleFunc("/health", svc.HealthCheck.Handler)

	router.Handle("/dataset-controller/{uri:.*}", datasetControllerProxy)

	router.Handle("/table/{uri:.*}", tableProxy)

	// Florence endpoints
	router.HandleFunc("/florence/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/florence/", redirectToFlorence)
	router.HandleFunc("/florence/index.html", redirectToFlorence)
	router.Path("/florence/publishing-queue").HandlerFunc(legacyIndexFile(cfg))
	router.Path("/florence/workspace").HandlerFunc(legacyIndexFile(cfg))
	router.HandleFunc("/florence/websocket", websocketHandler(svc.version))
	router.Path("/florence{uri:.*}").HandlerFunc(refactoredIndexFile(cfg))

	if cfg.SharedConfig.EnableDataAdmin {
		router.Handle("/data-admin{uri:.*}", dataAdminProxy)
	}

	// API and Frontend Routers
	router.Handle("/api/{uri:.*}", apiRouterProxy)
	router.Handle("/{uri:.*}", frontendRouterProxy)
	return router, nil
}

// Close gracefully shuts the service down in the required order, with timeout
func (svc *Service) Close(ctx context.Context) error {
	timeout := svc.Config.GracefulShutdownTimeout
	log.Info(ctx, "commencing graceful shutdown", log.Data{"graceful_shutdown_timeout": timeout})
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
			log.Error(ctx, "failed to shutdown http server", err)
			hasShutdownError = true
		}
	}()

	// wait for shutdown success (via cancel) or failure (timeout)
	<-ctx.Done()

	// timeout expired
	if ctx.Err() == context.DeadlineExceeded {
		log.Error(ctx, "shutdown timed out", ctx.Err())
		return ctx.Err()
	}

	// other error
	if hasShutdownError {
		err := errors.New("failed to shutdown gracefully")
		log.Error(ctx, "failed to shutdown gracefully ", err)
		return err
	}

	log.Info(ctx, "graceful shutdown was successful")
	return nil
}

func (svc *Service) registerCheckers(ctx context.Context, cfg *config.Config) (err error) {
	hasErrors := false

	if err = svc.HealthCheck.AddCheck("API router", svc.healthClient.Checker); err != nil {
		hasErrors = true
		log.Error(ctx, "error adding check for api router health client", err)
	}

	if hasErrors {
		return errors.New("Error(s) registering checkers for healthcheck")
	}
	return nil
}
