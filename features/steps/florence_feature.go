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
	"testing"
	"time"
)

type Chrome struct {
	execAllocatorCanceller context.CancelFunc
	ctxCanceller           context.CancelFunc
	ctx                    context.Context
}

type FlorenceFeature struct {
	ErrorFeature  componenttest.ErrorFeature
	svc           *service.Service
	errorChan     chan error
	HTTPServer    *http.Server
	ctx           context.Context
	FakeApiRouter *httpfake.HTTPFake
	chrome        Chrome
	LoggedInUser  string
}

func NewFlorenceFeature(t *testing.T) (*FlorenceFeature, error) {

	f := &FlorenceFeature{
		HTTPServer:    &http.Server{},
		errorChan:     make(chan error),
		FakeApiRouter: httpfake.New(httpfake.WithTesting(t)),
		ctx:           context.Background(),
	}

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	cfg, err := config.Get()
	if err != nil {
		return nil, err
	}

	cfg.APIRouterURL = f.FakeApiRouter.ResolveURL("")

	initFunctions := &initialiser.InitialiserMock{
		DoGetHTTPServerFunc:   f.DoGetHTTPServer,
		DoGetHealthCheckFunc:  DoGetHealthcheckOk,
		DoGetHealthClientFunc: DoGetHealthClient,
	}

	serviceList := service.NewServiceList(initFunctions)

	f.runApplication(cfg, serviceList, signals)

	return f, nil
}

func (f *FlorenceFeature) RegisterSteps(ctx *godog.ScenarioContext) {
	ctx.Step(`^I am logged in as "([^"]*)"$`, f.iAmLoggedInAs)
	ctx.Step(`^I create a new collection called "([^"]*)"$`, f.iCreateANewCollectionCalled)
}

func (f *FlorenceFeature) iAmLoggedInAs(username string) error {

	err := chromedp.Run(f.chrome.ctx,
		chromedp.Navigate("http://localhost:8080/florence/login"),
		chromedp.WaitVisible(`#app`),
		chromedp.SendKeys("#email", username),
		chromedp.SendKeys("#password", "anything"),
		chromedp.Click(".form button"),
	)

	if err != nil {
		log.Fatal(err)
	}

	f.LoggedInUser = username
	return nil
}

func (f *FlorenceFeature) iCreateANewCollectionCalled(collectionName string) error {
	_ = chromedp.Run(f.chrome.ctx,
		//chromedp.WaitVisible(`#collection-name"`),

		chromedp.SendKeys("#collection-name", collectionName),
		chromedp.Click(`input[value="manual"]`),
		chromedp.Click("button"),
	)
	time.Sleep(100 * time.Second)
	return nil
}

func (f *FlorenceFeature) Reset() *FlorenceFeature {
	f.FakeApiRouter.Reset()

	f.FakeApiRouter.NewHandler().Post("/login").Reply(200).Body([]byte(`bfe8fb97c7527d7f0f9db6b92e82e4f0866284f17d66ee5a8294dee9793880d6`))
	f.setJsonResponseForPost("/ping", `{"hasSession":true}`)

	f.FakeApiRouter.NewHandler().AssertBody([]byte(`{"name":"Census 2021"}`)).Post("/collection").Reply(200).Body([]byte(`{"id":"abc123","name":"Census 2021"}`))

	f.setJsonResponseForGet("/collectionDetails/abc123", `
{
    "approvalStatus": "IN_PROGRESS",
    "publishComplete": false,
    "isEncrypted": false,
    "timeseriesImportFiles": [],
    "id": "abc123",
    "name": "my collection",
    "type": "manual",
    "teams": []
}`)
	f.setJsonResponseForGet("/permission", fmt.Sprintf(`{"email":"%s","admin":true,"editor":true}`, f.LoggedInUser))
	f.setJsonResponseForGet("/collections", `
[{
    "approvalStatus": "IN_PROGRESS",
    "publishComplete": false,
    "isEncrypted": false,
    "timeseriesImportFiles": [],
    "id": "testg-4e611aeced894265d544038432771a1351ca892cd5e1796086c15c92ebfee5a5",
    "name": "TEST G",
    "type": "manual",
    "teams": []
}]`)
	f.setJsonResponseForGet("/teams", `{"teams":[{"id":3,"name":"Some team","members":["gracie@gracie.com"]}]}`)

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.DisableGPU,
		chromedp.Flag("headless", false),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	f.chrome.execAllocatorCanceller = cancel

	ctx, cancel := chromedp.NewContext(allocCtx, chromedp.WithLogf(log.Printf))
	f.chrome.ctxCanceller = cancel

	time.Sleep(1 * time.Second)
	log.Print("starting chrome ...")

	f.chrome.ctx = ctx
	return f
}

func (f *FlorenceFeature) Close() error {
	dplog.Event(f.ctx, "Shutting down app from test ...")
	if f.svc != nil {
		_ = f.svc.Close(f.ctx)
	}

	f.chrome.ctxCanceller()
	f.chrome.execAllocatorCanceller()

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

func (f *FlorenceFeature) setJsonResponseForGet(url string, responseBody string) {
	f.FakeApiRouter.NewHandler().Get(url).Reply(200).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))
}

func (f *FlorenceFeature) setJsonResponseForPost(url string, responseBody string) {
	f.FakeApiRouter.NewHandler().Post(url).Reply(200).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))
}

func (f *FlorenceFeature) runApplication(cfg *config.Config, serviceList *service.ExternalServiceList, signals chan os.Signal) {
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
