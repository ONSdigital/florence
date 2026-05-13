package config

import (
	"time"

	"github.com/kelseyhightower/envconfig"
)

// Default configuration values
const (
	DefaultBindAddr             = ":8080"
	DefaultAPIRouterURL         = "http://localhost:23200"
	DefaultFrontendRouterURL    = "http://localhost:20000"
	DefaultDatasetControllerURL = "http://localhost:24000"
	DefaultTableRendererURL     = "http://localhost:23300"
	DefaultDataAdminURL         = "http://localhost:29400/data-admin"
	DefaultAPIRouterVersion     = "v1"
)

// Config represents the configuration required for florence
type Config struct {
	BindAddr                   string        `envconfig:"BIND_ADDR"`
	APIRouterURL               string        `envconfig:"API_ROUTER_URL"`
	FrontendRouterURL          string        `envconfig:"ROUTER_URL"`
	DatasetControllerURL       string        `envconfig:"DATASET_CONTROLLER_URL"`
	TableRendererURL           string        `envconfig:"TABLE_RENDERER_URL"`
	DataAdminURL               string        `envconfig:"DATA_ADMIN_URL"`
	GracefulShutdownTimeout    time.Duration `envconfig:"GRACEFUL_SHUTDOWN_TIMEOUT"`
	HealthCheckInterval        time.Duration `envconfig:"HEALTHCHECK_INTERVAL"`
	HealthCheckCriticalTimeout time.Duration `envconfig:"HEALTHCHECK_CRITICAL_TIMEOUT"`
	SharedConfig               SharedConfig
}

// SharedConfig represents the configuration made available to the client-side application from the server
type SharedConfig struct {
	AllowedExternalPaths    []string `envconfig:"ALLOWED_EXTERNAL_PATHS" json:"allowedExternalPaths"`
	APIRouterVersion        string   `envconfig:"API_ROUTER_VERSION" json:"apiRouterVersion"`
	EnableCantabularJourney bool     `envconfig:"ENABLE_CANTABULAR_JOURNEY" json:"enableCantabularJourney"`
	EnableDataAdmin         bool     `envconfig:"ENABLE_DATA_ADMIN" json:"enableDataAdmin"`
	EnableMigrationField    bool     `envconfig:"ENABLE_MIGRATION_FIELD" json:"enableMigrationField"`
	EnableNewUpload         bool     `envconfig:"ENABLE_NEW_UPLOAD" json:"enableNewUpload"`
	EnablePermissionsAPI    bool     `envconfig:"ENABLE_PERMISSION_API" json:"enablePermissionsAPI"`
	EnableSystemNavBar      bool     `envconfig:"ENABLE_SYSTEM_NAV_BAR" json:"enableSystemNavBar"`
}

var cfg *Config

// Get retrieves the config from the environment for florence
func Get() (*Config, error) {
	if cfg != nil {
		return cfg, nil
	}

	cfg = &Config{
		BindAddr:             DefaultBindAddr,
		APIRouterURL:         DefaultAPIRouterURL,
		FrontendRouterURL:    DefaultFrontendRouterURL,
		DatasetControllerURL: DefaultDatasetControllerURL,
		TableRendererURL:     DefaultTableRendererURL,
		DataAdminURL:         DefaultDataAdminURL,
		SharedConfig: SharedConfig{
			AllowedExternalPaths:    []string{},
			APIRouterVersion:        DefaultAPIRouterVersion,
			EnableCantabularJourney: false,
			EnableDataAdmin:         true,
			EnableMigrationField:    false,
			EnableNewUpload:         false,
			EnablePermissionsAPI:    false,
			EnableSystemNavBar:      false,
		},
		GracefulShutdownTimeout:    10 * time.Second,
		HealthCheckInterval:        30 * time.Second,
		HealthCheckCriticalTimeout: 90 * time.Second,
	}

	return cfg, envconfig.Process("", cfg)
}
