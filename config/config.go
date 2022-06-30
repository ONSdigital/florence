package config

import (
	"time"

	"github.com/kelseyhightower/envconfig"
)

// Config represents the configuration required for florence
type Config struct {
	BindAddr                          string        `envconfig:"BIND_ADDR"`
	APIRouterURL                      string        `envconfig:"API_ROUTER_URL"`
	APIRouterVersion                  string        `envconfig:"API_ROUTER_VERSION"`
	FrontendRouterURL                 string        `envconfig:"ROUTER_URL"`
	DatasetControllerURL              string        `envconfig:"DATASET_CONTROLLER_URL"`
	TableRendererURL                  string        `envconfig:"TABLE_RENDERER_URL"`
	// should be removed when we use api-router
	CantabularMetadataExtractorAPIURL string        `envconfig:"CANTABULAR_METADATA_EXTRACTOR_API_URL"`
	GracefulShutdownTimeout           time.Duration `envconfig:"GRACEFUL_SHUTDOWN_TIMEOUT"`
	HealthCheckInterval               time.Duration `envconfig:"HEALTHCHECK_INTERVAL"`
	HealthCheckCriticalTimeout        time.Duration `envconfig:"HEALTHCHECK_CRITICAL_TIMEOUT"`
	SharedConfig                      SharedConfig
}

// SharedConfig represents the configuration made available to the client-side application from the server
type SharedConfig struct {
	EnableDatasetImport   bool `envconfig:"ENABLE_DATASET_IMPORT" json:"enableDatasetImport"`
	EnableNewSignIn       bool `envconfig:"ENABLE_NEW_SIGN_IN" json:"enableNewSignIn"`
	EnableNewUpload       bool `envconfig:"ENABLE_NEW_UPLOAD" json:"enableNewUpload"`
	EnableNewInteractives bool `envconfig:"ENABLE_NEW_INTERACTIVES" json:"enableNewInteractives"`
	EnablePermissionsAPI  bool `envconfig:"ENABLE_PERMISSION_API" json:"enablePermissionsAPI"`
}

var cfg *Config

// Get retrieves the config from the environment for florence
func Get() (*Config, error) {
	if cfg != nil {
		return cfg, nil
	}

	cfg = &Config{
		BindAddr:                          ":8080",
		APIRouterURL:                      "http://localhost:23200",
		APIRouterVersion:                  "v1",
		FrontendRouterURL:                 "http://localhost:20000",
		DatasetControllerURL:              "http://localhost:24000",
		TableRendererURL:                  "http://localhost:23300",
		CantabularMetadataExtractorAPIURL: "http://localhost:28300",
		SharedConfig:                      SharedConfig{EnableDatasetImport: true, EnableNewSignIn: false, EnableNewUpload: false, EnableNewInteractives: false, EnablePermissionsAPI: false},
		GracefulShutdownTimeout:           10 * time.Second,
		HealthCheckInterval:               30 * time.Second,
		HealthCheckCriticalTimeout:        90 * time.Second,
	}

	return cfg, envconfig.Process("", cfg)
}
