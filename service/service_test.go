package service_test

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"testing"

	"github.com/ONSdigital/dp-api-clients-go/health"
	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/service"
	serviceMock "github.com/ONSdigital/florence/service/mock"
	"github.com/ONSdigital/florence/upload"
	uploadMock "github.com/ONSdigital/florence/upload/mock"
	"github.com/pkg/errors"
	. "github.com/smartystreets/goconvey/convey"
)

var (
	ctx           = context.Background()
	testBuildTime = "BuildTime"
	testGitCommit = "GitCommit"
	testVersion   = "Version"
	errServer     = errors.New("HTTP Server error")
)

var (
	errHealthcheck = errors.New("healthCheck error")
	errVault       = errors.New("vault error")
	errS3          = errors.New("s3 error")
)

var funcDoGetVaultErr = func(vaultToken string, vaultAddress string, retries int) (upload.VaultClient, error) {
	return nil, errVault
}

var funcDoGetS3ClientErr = func(awsRegion string, bucketName string, encryptionEnabled bool) (upload.S3Client, error) {
	return nil, errS3
}

var funcDoGetHealthcheckErr = func(cfg *config.Config, buildTime string, gitCommit string, version string) (service.HealthChecker, error) {
	return nil, errHealthcheck
}

var funcDoGetHTTPServerNil = func(bindAddr string, router http.Handler) service.HTTPServer {
	return nil
}

func TestRun(t *testing.T) {

	Convey("Having a set of mocked dependencies", t, func() {

		cfg, err := config.Get()
		cfg.EncryptionDisabled = false
		So(err, ShouldBeNil)

		hcMock := &serviceMock.HealthCheckerMock{
			AddCheckFunc: func(name string, checker healthcheck.Checker) error { return nil },
			StartFunc:    func(ctx context.Context) {},
		}

		s3ClientMock := &uploadMock.S3ClientMock{}

		vaultMock := &uploadMock.VaultClientMock{}

		serverWg := &sync.WaitGroup{}
		serverMock := &serviceMock.HTTPServerMock{
			ListenAndServeFunc: func() error {
				serverWg.Done()
				return nil
			},
		}

		failingServerMock := &serviceMock.HTTPServerMock{
			ListenAndServeFunc: func() error {
				serverWg.Done()
				return errServer
			},
		}

		funcDoGetHealthcheckOk := func(cfg *config.Config, buildTime string, gitCommit string, version string) (service.HealthChecker, error) {
			return hcMock, nil
		}

		funcDoGetHTTPServer := func(bindAddr string, router http.Handler) service.HTTPServer {
			return serverMock
		}

		funcDoGetFailingHTTPSerer := func(bindAddr string, router http.Handler) service.HTTPServer {
			return failingServerMock
		}

		funcDoGetHealthClientOk := func(name string, url string) *health.Client {
			return &health.Client{
				URL:  url,
				Name: name,
			}
		}

		funcDoGetS3ClientOk := func(awsRegion string, bucketName string, encryptionEnabled bool) (upload.S3Client, error) {
			return s3ClientMock, nil

		}

		funcDoGetVaultOk := func(vaultToken string, vaultAddress string, retries int) (upload.VaultClient, error) {
			return vaultMock, nil
		}

		Convey("Given that initialising Vault returns an error", func() {
			initMock := &serviceMock.InitialiserMock{
				DoGetVaultFunc: funcDoGetVaultErr,
			}
			svcErrors := make(chan error, 1)
			svcList := service.NewServiceList(initMock)
			_, err := service.Run(ctx, cfg, svcList, testBuildTime, testGitCommit, testVersion, svcErrors)

			Convey("Then service Run fails with the same error and the flag is not set. No further initialisations are attempted", func() {
				So(err, ShouldResemble, errVault)
				So(svcList.HealthCheck, ShouldBeFalse)
			})
		})

		Convey("Given that initialising the S3 client returns an error", func() {
			initMock := &serviceMock.InitialiserMock{
				DoGetVaultFunc:    funcDoGetVaultOk,
				DoGetS3ClientFunc: funcDoGetS3ClientErr,
			}
			svcErrors := make(chan error, 1)
			svcList := service.NewServiceList(initMock)
			_, err := service.Run(ctx, cfg, svcList, testBuildTime, testGitCommit, testVersion, svcErrors)

			Convey("Then service Run fails with the same error and the flag is not set. No further initialisations are attempted", func() {
				So(err, ShouldResemble, errS3)
				So(svcList.HealthCheck, ShouldBeFalse)
			})
		})

		Convey("Given that initialising Helthcheck returns an error", func() {
			initMock := &serviceMock.InitialiserMock{
				DoGetVaultFunc:        funcDoGetVaultOk,
				DoGetS3ClientFunc:     funcDoGetS3ClientOk,
				DoGetHealthClientFunc: funcDoGetHealthClientOk,
				DoGetHealthCheckFunc:  funcDoGetHealthcheckErr,
			}
			svcErrors := make(chan error, 1)
			svcList := service.NewServiceList(initMock)
			_, err := service.Run(ctx, cfg, svcList, testBuildTime, testGitCommit, testVersion, svcErrors)

			Convey("Then service Run fails with the same error and the flag is not set. No further initialisations are attempted", func() {
				So(err, ShouldResemble, errHealthcheck)
				So(svcList.HealthCheck, ShouldBeFalse)
			})
		})

		Convey("Given that Checkers cannot be registered", func() {

			errAddheckFail := errors.New("Error(s) registering checkers for healthcheck")
			hcMockAddFail := &serviceMock.HealthCheckerMock{
				AddCheckFunc: func(name string, checker healthcheck.Checker) error { return errAddheckFail },
				StartFunc:    func(ctx context.Context) {},
			}

			initMock := &serviceMock.InitialiserMock{
				DoGetVaultFunc:        funcDoGetVaultOk,
				DoGetS3ClientFunc:     funcDoGetS3ClientOk,
				DoGetHealthClientFunc: funcDoGetHealthClientOk,
				DoGetHealthCheckFunc: func(cfg *config.Config, buildTime string, gitCommit string, version string) (service.HealthChecker, error) {
					return hcMockAddFail, nil
				},
			}
			svcErrors := make(chan error, 1)
			svcList := service.NewServiceList(initMock)
			_, err := service.Run(ctx, cfg, svcList, testBuildTime, testGitCommit, testVersion, svcErrors)

			Convey("Then service Run fails, but all checks try to register", func() {
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldResemble, fmt.Sprintf("unable to register checkers: %s", errAddheckFail.Error()))
				So(svcList.HealthCheck, ShouldBeTrue)
				So(len(hcMockAddFail.AddCheckCalls()), ShouldEqual, 3)
				So(hcMockAddFail.AddCheckCalls()[0].Name, ShouldResemble, "S3")
				So(hcMockAddFail.AddCheckCalls()[1].Name, ShouldResemble, "API router")
				So(hcMockAddFail.AddCheckCalls()[2].Name, ShouldResemble, "Vault")
			})
		})

		Convey("Given that all dependencies are successfully initialised", func() {
			initMock := &serviceMock.InitialiserMock{
				DoGetVaultFunc:        funcDoGetVaultOk,
				DoGetS3ClientFunc:     funcDoGetS3ClientOk,
				DoGetHealthClientFunc: funcDoGetHealthClientOk,
				DoGetHealthCheckFunc:  funcDoGetHealthcheckOk,
				DoGetHTTPServerFunc:   funcDoGetHTTPServer,
			}
			svcErrors := make(chan error, 1)
			svcList := service.NewServiceList(initMock)
			serverWg.Add(1)
			_, err := service.Run(ctx, cfg, svcList, testBuildTime, testGitCommit, testVersion, svcErrors)

			Convey("Then service Run succeeds and all the flags are set", func() {
				So(err, ShouldBeNil)
				So(svcList.HealthCheck, ShouldBeTrue)
			})

			Convey("The checkers are registered and the healthcheck and http server started", func() {
				So(len(hcMock.AddCheckCalls()), ShouldEqual, 3)
				So(hcMock.AddCheckCalls()[0].Name, ShouldResemble, "S3")
				So(hcMock.AddCheckCalls()[1].Name, ShouldResemble, "API router")
				So(hcMock.AddCheckCalls()[2].Name, ShouldResemble, "Vault")
				So(len(initMock.DoGetHTTPServerCalls()), ShouldEqual, 1)
				So(initMock.DoGetHTTPServerCalls()[0].BindAddr, ShouldEqual, ":8080")
				So(len(hcMock.StartCalls()), ShouldEqual, 1)
				serverWg.Wait() // Wait for HTTP server go-routine to finish
				So(len(serverMock.ListenAndServeCalls()), ShouldEqual, 1)
			})
		})

		Convey("Given that all dependencies are successfully initialised and encryption is disabled", func() {
			cfg.EncryptionDisabled = true
			initMock := &serviceMock.InitialiserMock{
				DoGetS3ClientFunc:     funcDoGetS3ClientOk,
				DoGetHealthClientFunc: funcDoGetHealthClientOk,
				DoGetHealthCheckFunc:  funcDoGetHealthcheckOk,
				DoGetHTTPServerFunc:   funcDoGetHTTPServer,
			}
			svcErrors := make(chan error, 1)
			svcList := service.NewServiceList(initMock)
			serverWg.Add(1)
			_, err := service.Run(ctx, cfg, svcList, testBuildTime, testGitCommit, testVersion, svcErrors)

			Convey("Then service Run successfully initialises all dependencies except Vault, and all the flags are set", func() {
				So(err, ShouldBeNil)
				So(svcList.HealthCheck, ShouldBeTrue)
			})

			Convey("The checkers, except Vault, are registered and the healthcheck and http server started", func() {
				So(len(hcMock.AddCheckCalls()), ShouldEqual, 2)
				So(hcMock.AddCheckCalls()[0].Name, ShouldResemble, "S3")
				So(hcMock.AddCheckCalls()[1].Name, ShouldResemble, "API router")
				So(len(initMock.DoGetHTTPServerCalls()), ShouldEqual, 1)
				So(initMock.DoGetHTTPServerCalls()[0].BindAddr, ShouldEqual, ":8080")
				So(len(hcMock.StartCalls()), ShouldEqual, 1)
				serverWg.Wait() // Wait for HTTP server go-routine to finish
				So(len(serverMock.ListenAndServeCalls()), ShouldEqual, 1)
			})
		})

		Convey("Given that all dependencies are successfully initialised but the http server fails", func() {

			initMock := &serviceMock.InitialiserMock{
				DoGetVaultFunc:        funcDoGetVaultOk,
				DoGetS3ClientFunc:     funcDoGetS3ClientOk,
				DoGetHealthClientFunc: funcDoGetHealthClientOk,
				DoGetHealthCheckFunc:  funcDoGetHealthcheckOk,
				DoGetHTTPServerFunc:   funcDoGetFailingHTTPSerer,
			}
			svcErrors := make(chan error, 1)
			svcList := service.NewServiceList(initMock)
			serverWg.Add(1)
			_, err := service.Run(ctx, cfg, svcList, testBuildTime, testGitCommit, testVersion, svcErrors)
			So(err, ShouldBeNil)

			Convey("Then the error is returned in the error channel", func() {
				sErr := <-svcErrors
				So(sErr.Error(), ShouldResemble, fmt.Sprintf("failure in http listen and serve: %s", errServer.Error()))
				So(len(failingServerMock.ListenAndServeCalls()), ShouldEqual, 1)
			})
		})
	})
}

func TestClose(t *testing.T) {

	Convey("Having a correctly initialised service", t, func() {

		cfg, err := config.Get()
		So(err, ShouldBeNil)

		hcStopped := false

		// healthcheck Stop does not depend on any other service being closed/stopped
		hcMock := &serviceMock.HealthCheckerMock{
			AddCheckFunc: func(name string, checker healthcheck.Checker) error { return nil },
			StartFunc:    func(ctx context.Context) {},
			StopFunc:     func() { hcStopped = true },
		}

		// server Shutdown will fail if healthcheck is not stopped
		serverMock := &serviceMock.HTTPServerMock{
			ListenAndServeFunc: func() error { return nil },
			ShutdownFunc: func(ctx context.Context) error {
				if !hcStopped {
					return errors.New("Server stopped before healthcheck")
				}
				return nil
			},
		}

		Convey("Closing the service results in all the dependencies being closed in the expected order", func() {
			svcList := service.NewServiceList(nil)
			svcList.HealthCheck = true
			svc := service.Service{
				Config:      cfg,
				ServiceList: svcList,
				Server:      serverMock,
				HealthCheck: hcMock,
			}
			err = svc.Close(context.Background())
			So(err, ShouldBeNil)
			So(len(hcMock.StopCalls()), ShouldEqual, 1)
			So(len(serverMock.ShutdownCalls()), ShouldEqual, 1)
		})

		Convey("If services fail to stop, the Close operation tries to close all dependencies and returns an error", func() {
			failingserverMock := &serviceMock.HTTPServerMock{
				ListenAndServeFunc: func() error { return nil },
				ShutdownFunc: func(ctx context.Context) error {
					return errors.New("Failed to stop http server")
				},
			}

			svcList := service.NewServiceList(nil)
			svcList.HealthCheck = true
			svc := service.Service{
				Config:      cfg,
				ServiceList: svcList,
				Server:      failingserverMock,
				HealthCheck: hcMock,
			}
			err = svc.Close(context.Background())
			So(err, ShouldNotBeNil)
			So(err.Error(), ShouldResemble, "failed to shutdown gracefully")
			So(len(hcMock.StopCalls()), ShouldEqual, 1)
			So(len(failingserverMock.ShutdownCalls()), ShouldEqual, 1)
		})

		// Convey("If service times out while shutting down, the Close operation fails with the expected error", func() {
		// 	cfg.GracefulShutdownTimeout = 1 * time.Millisecond
		// 	timeoutServerMock := &mock.HTTPServerMock{
		// 		ListenAndServeFunc: func() error { return nil },
		// 		ShutdownFunc: func(ctx context.Context) error {
		// 			time.Sleep(2 * time.Millisecond)
		// 			return nil
		// 		},
		// 	}

		// 	svcList := service.NewServiceList(nil)
		// 	svcList.HealthCheck = true
		// 	svc := service.Service{
		// 		Config:      cfg,
		// 		ServiceList: svcList,
		// 		Server:      timeoutServerMock,
		// 		HealthCheck: hcMock,
		// 	}
		// 	err = svc.Close(context.Background())
		// 	So(err, ShouldNotBeNil)
		// 	So(err.Error(), ShouldResemble, "context deadline exceeded")
		// 	So(len(hcMock.StopCalls()), ShouldEqual, 1)
		// 	So(len(timeoutServerMock.ShutdownCalls()), ShouldEqual, 1)
		// })
	})
}
