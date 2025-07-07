package steps

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ONSdigital/dp-api-clients-go/v2/health"
	componenttest "github.com/ONSdigital/dp-component-test"
	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/service"
	"github.com/ONSdigital/florence/service/mock"
	dplog "github.com/ONSdigital/log.go/v2/log"
	"github.com/chromedp/chromedp"
	"github.com/cucumber/godog"
)

type Chrome struct {
	execAllocatorCanceller context.CancelFunc
	ctxCanceller           context.CancelFunc
	ctx                    context.Context
}

type Component struct {
	componenttest.ErrorFeature
	svc          *service.Service
	errorChan    chan error
	HTTPServer   *http.Server
	ctx          context.Context
	FakeAPI      *FakeAPI
	chrome       Chrome
	SignedInUser string
	user         User
}

func NewFlorenceComponent() (*Component, error) {
	c := &Component{
		HTTPServer: &http.Server{
			ReadTimeout: 3 * time.Minute,
		},
		errorChan: make(chan error),
		ctx:       context.Background(),
	}

	c.FakeAPI = NewFakeAPI(c)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	cfg, err := config.Get()
	if err != nil {
		return nil, err
	}

	cfg.APIRouterURL = c.FakeAPI.fakeHTTP.ResolveURL("")

	initFunctions := &mock.InitialiserMock{
		DoGetHTTPServerFunc:   c.DoGetHTTPServer,
		DoGetHealthCheckFunc:  DoGetHealthcheckOk,
		DoGetHealthClientFunc: DoGetHealthClient,
	}

	serviceList := service.NewServiceList(initFunctions)

	c.user = NewPublisher(c.FakeAPI, c.chrome.ctx)

	c.runApplication(cfg, serviceList, signals)

	return c, nil
}

// This step needs to be implemented once the service has been updated to support new auth
func (c *Component) iCreateANewCollectionCalledForManualPublishing(collectionName string) error {
	return godog.ErrUndefined
}

// This step needs to be implemented once the service has been updated to support new auth
func (c *Component) iShouldBePresentedWithAEditableCollectionTitled(collectionTitle string) error {
	return godog.ErrUndefined
}

// This step needs to be implemented once the service has been updated to support new auth
func (c *Component) theCollectionShouldBe(collectionPublishSchedule string) error {
	return godog.ErrUndefined
}

// This step needs to be implemented once the service has been updated to support new auth
func (c *Component) theseCollectionCreationDetailsShouldHaveBeenSent(collectionDetails *godog.DocString) error {
	return godog.ErrUndefined
}

func (c *Component) Reset() *Component {
	c.FakeAPI.Reset()

	c.FakeAPI.setJSONResponseForPost("/ping", `{"hasSession":true}`, 200)
	c.FakeAPI.setJSONResponseForGet("/collections", `[]`)
	c.FakeAPI.setJSONResponseForGet("/teams", `{"teams":[{"id":3,"name":"Some team","members":["test@ons.com"]}]}`)

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.DisableGPU,
		// set this to false to be able to watch the browser in action
		chromedp.Flag("headless", true),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	c.chrome.execAllocatorCanceller = cancel

	ctx, cancel := chromedp.NewContext(allocCtx, chromedp.WithLogf(log.Printf))
	c.chrome.ctxCanceller = cancel

	log.Print("re-starting chrome ...")

	c.chrome.ctx = ctx
	c.user = NewPublisher(c.FakeAPI, c.chrome.ctx)

	return c
}

func (c *Component) Close() error {
	dplog.Info(c.ctx, "Shutting down app from test ...")
	if c.svc != nil {
		_ = c.svc.Close(c.ctx)
	}

	c.FakeAPI.Close()
	c.chrome.ctxCanceller()
	c.chrome.execAllocatorCanceller()

	return nil
}

func (c *Component) InitialiseService() (http.Handler, error) {
	return c.HTTPServer.Handler, nil
}

func (c *Component) DoGetHTTPServer(bindAddr string, router http.Handler) service.HTTPServer {
	c.HTTPServer.Addr = bindAddr
	c.HTTPServer.Handler = router
	return c.HTTPServer
}

func (c *Component) runApplication(cfg *config.Config, serviceList *service.ExternalServiceList, signals chan os.Signal) {
	go func() {
		c.svc, _ = service.Run(c.ctx, cfg, serviceList, "1", "", "", c.errorChan)

		// blocks until an os interrupt or a fatal error occurs
		select {
		case err := <-c.errorChan:
			dplog.Error(c.ctx, "service error received", err)
		case sig := <-signals:
			dplog.Info(c.ctx, "os signal received", dplog.Data{"signal": sig})
		}
	}()
}

// DoGetHealthCheck creates a healthcheck with versionInfo
func DoGetHealthcheckOk(cfg *config.Config, buildTime, gitCommit, version string) (service.HealthChecker, error) {
	return &mock.HealthCheckerMock{
		AddCheckFunc: func(name string, checker healthcheck.Checker) error { return nil },
		StartFunc:    func(ctx context.Context) {},
		StopFunc:     func() {},
	}, nil
}

// GetHealthClient returns a healthclient for the provided URL
func DoGetHealthClient(name, url string) *health.Client {
	return &health.Client{}
}
