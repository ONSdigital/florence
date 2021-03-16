package steps

import (
	"context"
	"github.com/ONSdigital/dp-api-clients-go/health"
	componenttest "github.com/ONSdigital/dp-component-test"
	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/service"
	initialiser "github.com/ONSdigital/florence/service/mock"
	"github.com/cucumber/godog"
	"net/http"
)

type FlorenceFeature struct {
	ErrorFeature   componenttest.ErrorFeature
	svc            *service.Service
	errorChan      chan error
	Config         *config.Config
	HTTPServer     *http.Server
	ServiceRunning bool
}

func NewDatasetFeature() (*FlorenceFeature, error) {

	f := &FlorenceFeature{
		HTTPServer:     &http.Server{},
		errorChan:      make(chan error),
		ServiceRunning: false,
	}

	svcErrors := make(chan error, 1)

	cfg, err := config.Get()
	if err != nil {
		return nil, err
	}

	initFunctions := &initialiser.InitialiserMock{
		DoGetHealthCheckFunc:   f.DoGetHealthcheckOk,
		DoGetHTTPServerFunc:    f.DoGetHTTPServer,
		DoGetHealthClientFunc:  f.DoGetHealthClient,
	}
	ctx := context.Background()

	serviceList := service.NewServiceList(initFunctions)

	f.svc, err = service.Run(ctx, cfg, serviceList, "1", "", "", svcErrors)
	if err != nil {
		return nil, err
	}

	return f, nil
}

func (f *FlorenceFeature) RegisterSteps(ctx *godog.ScenarioContext) {
	ctx.Step(`^I upload the dataset "([^"]*)"$`, f.iUploadTheDataset)
}

func (f *FlorenceFeature) iUploadTheDataset(datasetFileName string) error {
	return godog.ErrPending
}

func (f *FlorenceFeature) Reset() *FlorenceFeature {
	return f
}

func (f *FlorenceFeature) Close() error {
	if f.svc != nil && f.ServiceRunning {
		f.svc.Close(context.Background())
		f.ServiceRunning = false
	}
	return nil
}

func (f *FlorenceFeature) InitialiseService() (http.Handler, error) {
	return f.HTTPServer.Handler, nil
}

func (f *FlorenceFeature) DoGetHTTPServer(bindAddr string, router http.Handler) service.HTTPServer {
	f.HTTPServer.Addr = bindAddr
	f.HTTPServer.Handler = router
	return f.HTTPServer
}

// DoGetHealthCheck creates a healthcheck with versionInfo
func (e *FlorenceFeature) DoGetHealthcheckOk(cfg *config.Config, buildTime, gitCommit, version string) (service.HealthChecker, error) {
	versionInfo, _ := healthcheck.NewVersionInfo(buildTime, gitCommit, version)
	hc := healthcheck.New(versionInfo, cfg.HealthCheckCriticalTimeout, cfg.HealthCheckInterval)
	return &hc, nil
}

// GetHealthClient returns a healthclient for the provided URL
func (e *FlorenceFeature) DoGetHealthClient(name, url string) *health.Client {
	return &health.Client{}
}
