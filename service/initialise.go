package service

import (
	"net/http"
	"time"

	"github.com/ONSdigital/dp-api-clients-go/health"
	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	dphttp "github.com/ONSdigital/dp-net/http"
	s3client "github.com/ONSdigital/dp-s3"
	vault "github.com/ONSdigital/dp-vault"
	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/florence/upload"
)

// ExternalServiceList holds the initialiser and initialisation state of external services.
type ExternalServiceList struct {
	HealthCheck bool
	Init        Initialiser
}

// NewServiceList creates a new service list with the provided initialiser
func NewServiceList(initialiser Initialiser) *ExternalServiceList {
	return &ExternalServiceList{
		Init: initialiser,
	}
}

// Init implements the Initialiser interface to initialise dependencies
type Init struct{}

// GetHTTPServer creates an http server
func (e *ExternalServiceList) GetHTTPServer(bindAddr string, router http.Handler) HTTPServer {
	s := e.Init.DoGetHTTPServer(bindAddr, router)
	return s
}

// GetHealthClient returns a healthclient for the provided URL
func (e *ExternalServiceList) GetHealthClient(name, url string) *health.Client {
	return e.Init.DoGetHealthClient(name, url)
}

// GetHealthCheck creates a healthcheck with versionInfo and sets the HealthCheck flag to true
func (e *ExternalServiceList) GetHealthCheck(cfg *config.Config, buildTime, gitCommit, version string) (HealthChecker, error) {
	hc, err := e.Init.DoGetHealthCheck(cfg, buildTime, gitCommit, version)
	if err != nil {
		return nil, err
	}
	e.HealthCheck = true
	return hc, nil
}

// GetVault creates a new vault client
func (e *ExternalServiceList) GetVault(cfg *config.Config) (upload.VaultClient, error) {
	return e.Init.DoGetVault(cfg.VaultToken, cfg.VaultAddr, 3)
}

// GetS3Client returns a new S3 client
func (e *ExternalServiceList) GetS3Client(cfg *config.Config) (s3Client upload.S3Client, err error) {
	return e.Init.DoGetS3Client(cfg.AwsRegion, cfg.UploadBucketName, !cfg.EncryptionDisabled)
}

// DoGetHTTPServer creates an HTTP Server with the provided bind address and router
func (e *Init) DoGetHTTPServer(bindAddr string, router http.Handler) HTTPServer {
	s := dphttp.NewServer(bindAddr, router)
	s.HandleOSSignals = false
	s.Server.IdleTimeout = 120 * time.Second
	s.Server.WriteTimeout = 120 * time.Second
	s.Server.ReadTimeout = 30 * time.Second
	return s
}

// DoGetHealthClient creates a new Health Client for the provided name and url
func (e *Init) DoGetHealthClient(name, url string) *health.Client {
	return health.NewClient(name, url)
}

// DoGetHealthCheck creates a healthcheck with versionInfo
func (e *Init) DoGetHealthCheck(cfg *config.Config, buildTime, gitCommit, version string) (HealthChecker, error) {
	versionInfo, err := healthcheck.NewVersionInfo(buildTime, gitCommit, version)
	if err != nil {
		return nil, err
	}
	hc := healthcheck.New(versionInfo, cfg.HealthCheckCriticalTimeout, cfg.HealthCheckInterval)
	return &hc, nil
}

// DoGetVault creates a new Vault client
func (e *Init) DoGetVault(vaultToken, vaultAddress string, retries int) (upload.VaultClient, error) {
	return vault.CreateClient(vaultToken, vaultAddress, retries)
}

// DoGetS3Client creates a new S3 Client
func (e *Init) DoGetS3Client(awsRegion, bucketName string, encryptionEnabled bool) (upload.S3Client, error) {
	return s3client.NewClient(awsRegion, bucketName, encryptionEnabled)
}
