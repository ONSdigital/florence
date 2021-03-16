package steps

import (
	"context"
	"fmt"
	"github.com/ONSdigital/dp-api-clients-go/health"
	componenttest "github.com/ONSdigital/dp-component-test"
	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/service"
	"github.com/ONSdigital/florence/service/mock"
	initialiser "github.com/ONSdigital/florence/service/mock"
	dplog "github.com/ONSdigital/log.go/log"
	"github.com/chromedp/chromedp"
	"github.com/cucumber/godog"
	"github.com/maxcnunes/httpfake"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type FlorenceFeature struct {
	ErrorFeature  componenttest.ErrorFeature
	svc           *service.Service
	errorChan     chan error
	HTTPServer    *http.Server
	ctx           context.Context
	FakeApiRouter *httpfake.HTTPFake
}

func NewFlorenceFeature() (*FlorenceFeature, error) {

	f := &FlorenceFeature{
		HTTPServer:    &http.Server{},
		errorChan:     make(chan error),
		FakeApiRouter: httpfake.New(),
		ctx:           context.Background(),
	}


	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	cfg, err := config.Get()
	if err != nil {
		return nil, err
	}

	cfg.APIRouterURL = f.FakeApiRouter.ResolveURL("")

	f.FakeApiRouter.NewHandler().Post("/ping").Reply(200)

	initFunctions := &initialiser.InitialiserMock{
		DoGetHealthCheckFunc:  f.DoGetHealthcheckOk,
		DoGetHTTPServerFunc:   f.DoGetHTTPServer,
		DoGetHealthClientFunc: f.DoGetHealthClient,
	}

	serviceList := service.NewServiceList(initFunctions)

	go func() {
		f.svc, _ = service.Run(f.ctx, cfg, serviceList, "1", "", "", f.errorChan)

		// blocks until an os interrupt or a fatal error occurs
		select {
		case err := <-f.errorChan:
			dplog.Event(f.ctx, "service error received", dplog.ERROR, dplog.Error(err))
		case sig := <-signals:
			dplog.Event(f.ctx, "os signal received", dplog.Data{"signal": sig}, dplog.INFO)
		}
	}()

	return f, nil
}

func (f *FlorenceFeature) RegisterSteps(ctx *godog.ScenarioContext) {
	ctx.Step(`^I upload the dataset "([^"]*)"$`, f.iUploadTheDataset)
}

func (f *FlorenceFeature) iUploadTheDataset(datasetFileName string) error {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.DisableGPU,
		chromedp.Flag("headless", false),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx, chromedp.WithLogf(log.Printf))
	defer cancel()

	time.Sleep(5 * time.Second)

	log.Print("starting chrome ...")

	var example string

	err := chromedp.Run(ctx,
		chromedp.Navigate("http://localhost:8080/florence/login"),
		chromedp.WaitVisible(`#app`),
		chromedp.OuterHTML(`#app`, &example),
	)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Got HTML:\n%s", example)

	return nil
}

func (f *FlorenceFeature) Reset() *FlorenceFeature {
	return f
}

func (f *FlorenceFeature) Close() error {
	dplog.Event(f.ctx, "Shutting down app from test ...")
	_ = f.svc.Close(f.ctx)
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
	return &mock.HealthCheckerMock{
		AddCheckFunc: func(name string, checker healthcheck.Checker) error { return nil },
		StartFunc:    func(ctx context.Context) {},
		StopFunc:     func() {},
	}, nil
}

// GetHealthClient returns a healthclient for the provided URL
func (e *FlorenceFeature) DoGetHealthClient(name, url string) *health.Client {
	return &health.Client{}
}
