package config

import (
	"time"

	"github.com/kelseyhightower/envconfig"
)

// Config represents the configuration required for florence
type Config struct {
	BindAddr                   string        `envconfig:"BIND_ADDR"`
	APIRouterURL               string        `envconfig:"API_ROUTER_URL"`
	APIRouterVersion           string        `envconfig:"API_ROUTER_VERSION"`
	RouterURL                  string        `envconfig:"ROUTER_URL"`
	DatasetControllerURL       string        `envconfig:"DATASET_CONTROLLER_URL"`
	TableRendererURL           string        `envconfig:"TABLE_RENDERER_URL"`
	AwsRegion                  string        `envconfig:"AWS_REGION"`
	UploadBucketName           string        `envconfig:"UPLOAD_BUCKET_NAME"`
	EncryptionDisabled         bool          `envconfig:"ENCRYPTION_DISABLED"`
	VaultAddr                  string        `envconfig:"VAULT_ADDR"`
	VaultToken                 string        `envconfig:"VAULT_TOKEN"                json:"-"`
	VaultPath                  string        `envconfig:"VAULT_PATH"`
	GracefulShutdownTimeout    time.Duration `envconfig:"GRACEFUL_SHUTDOWN_TIMEOUT"`
	HealthCheckInterval        time.Duration `envconfig:"HEALTHCHECK_INTERVAL"`
	HealthCheckCriticalTimeout time.Duration `envconfig:"HEALTHCHECK_CRITICAL_TIMEOUT"`
	SharedConfig               SharedConfig
}

// SharedConfig represents the configuration made available to the client-side application from the server
type SharedConfig struct {
	EnableDatasetImport      bool `envconfig:"ENABLE_DATASET_IMPORT" json:"enableDatasetImport"`
	EnableHomepagePublishing bool `envconfig:"ENABLE_HOMEPAGE_PUBLISHING" json:"enableHomepagePublishing"`
}

var cfg *Config

// Get retrieves the config from the environment for florence
func Get() (*Config, error) {
	if cfg != nil {
		return cfg, nil
	}

	cfg = &Config{
		BindAddr:                   ":8080",
		APIRouterURL:               "http://localhost:23200", // API router
		APIRouterVersion:           "v1",
		RouterURL:                  "http://localhost:20000", // Frontend router
		DatasetControllerURL:       "http://localhost:24000",
		TableRendererURL:           "http://localhost:23300",
		AwsRegion:                  "eu-west-1",
		UploadBucketName:           "dp-frontend-florence-file-uploads",
		SharedConfig:               SharedConfig{EnableDatasetImport: false, EnableHomepagePublishing: false},
		EncryptionDisabled:         false,
		VaultAddr:                  "http://localhost:8200",
		VaultToken:                 "",
		VaultPath:                  "secret/shared/psk",
		GracefulShutdownTimeout:    10 * time.Second,
		HealthCheckInterval:        30 * time.Second,
		HealthCheckCriticalTimeout: 90 * time.Second,
	}

	return cfg, envconfig.Process("", cfg)
}
