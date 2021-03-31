package steps

import (
	"context"
	"github.com/ONSdigital/dp-api-clients-go/health"
	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/service"
	"github.com/ONSdigital/florence/service/mock"
	initialiser "github.com/ONSdigital/florence/service/mock"
	dplog "github.com/ONSdigital/log.go/log"
	"github.com/chromedp/chromedp"
	"github.com/cucumber/godog"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"testing"
)

type Chrome struct {
	execAllocatorCanceller context.CancelFunc
	ctxCanceller           context.CancelFunc
	ctx                    context.Context
}

type Component struct {
	errorFeature *ErrorFeature
	svc          *service.Service
	errorChan    chan error
	HTTPServer   *http.Server
	ctx          context.Context
	FakeApi      *FakeApi
	chrome       Chrome
	LoggedInUser string
	publisher    Publisher
}

func NewFlorenceComponent(t* testing.T) (*Component, error) {
	mt := &ErrorFeature{
		TB: t,
	}

	f := &Component{
		HTTPServer:   &http.Server{},
		errorChan:    make(chan error),
		FakeApi:      NewFakeApi(mt),
		ctx:          context.Background(),
		errorFeature: mt,
	}

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	cfg, err := config.Get()
	if err != nil {
		return nil, err
	}

	cfg.APIRouterURL = f.FakeApi.fakeHttp.ResolveURL("")

	initFunctions := &initialiser.InitialiserMock{
		DoGetHTTPServerFunc:   f.DoGetHTTPServer,
		DoGetHealthCheckFunc:  DoGetHealthcheckOk,
		DoGetHealthClientFunc: DoGetHealthClient,
	}

	serviceList := service.NewServiceList(initFunctions)

	f.runApplication(cfg, serviceList, signals)

	return f, nil
}

func (f *Component) RegisterSteps(ctx *godog.ScenarioContext) {
	ctx.Step(`^I am logged in as "([^"]*)"$`, f.iAmLoggedInAs)

	ctx.Step(`^I create a new collection called "([^"]*)" for manual publishing$`, f.iCreateANewCollectionCalledForManualPublishing)
	ctx.Step(`^I should be presented with a editable collection titled "([^"]*)"$`, f.iShouldBePresentedWithAEditableCollectionTitled)
	ctx.Step(`^the collection publishing schedule should be "([^"]*)"$`, f.theCollectionShouldBe)
}

func (f *Component) iAmLoggedInAs(username string) error {

	err := f.publisher.logIn(username)
	if err != nil {
		return err
	}

	f.LoggedInUser = username
	return nil
}

func (f *Component) iCreateANewCollectionCalledForManualPublishing(collectionName string) error {
	collectionAction := NewCollectionAction(f.errorFeature, f.FakeApi, f.chrome.ctx)
	if err := collectionAction.create(collectionName); err != nil {
		return err
	}

	//time.Sleep(2 * time.Second)

	return f.errorFeature.StepError()
}

func (f *Component) iShouldBePresentedWithAEditableCollectionTitled(collectionTitle string) error {
	collectionAction := NewCollectionAction(f.errorFeature, f.FakeApi, f.chrome.ctx)

	if err := collectionAction.assertHasTitle(collectionTitle); err != nil {
		return err
	}

	return f.errorFeature.StepError()

}

func (f *Component) theCollectionShouldBe(collectionPublishSchedule string) error {
	collectionAction := NewCollectionAction(f.errorFeature, f.FakeApi, f.chrome.ctx)

	if err := collectionAction.assertHasPublishSchedule(collectionPublishSchedule); err != nil {
		return err
	}

	return f.errorFeature.StepError()
}


func (f *Component) Reset() *Component {
	f.FakeApi.Reset()

	f.FakeApi.setJsonResponseForPost("/ping", `{"hasSession":true}`)
	f.FakeApi.setJsonResponseForGet("/collections", `[]`)
	f.FakeApi.setJsonResponseForGet("/teams", `{"teams":[{"id":3,"name":"Some team","members":["test@ons.com"]}]}`)

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.DisableGPU,
		chromedp.Flag("headless", true),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	f.chrome.execAllocatorCanceller = cancel

	ctx, cancel := chromedp.NewContext(allocCtx, chromedp.WithLogf(log.Printf))
	f.chrome.ctxCanceller = cancel

	log.Print("re-starting chrome ...")

	f.chrome.ctx = ctx

	f.publisher.chromeCtx = ctx
	f.publisher.fakeApi = f.FakeApi
	return f
}

func (f *Component) Close() error {
	dplog.Event(f.ctx, "Shutting down app from test ...")
	if f.svc != nil {
		_ = f.svc.Close(f.ctx)
	}

	f.FakeApi.Close()
	f.chrome.ctxCanceller()
	f.chrome.execAllocatorCanceller()

	return nil
}

func (f *Component) InitialiseService() (http.Handler, error) {
	return f.HTTPServer.Handler, nil
}

func (f *Component) DoGetHTTPServer(bindAddr string, router http.Handler) service.HTTPServer {
	f.HTTPServer.Addr = bindAddr
	f.HTTPServer.Handler = router
	return f.HTTPServer
}

func (f *Component) runApplication(cfg *config.Config, serviceList *service.ExternalServiceList, signals chan os.Signal) {
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
