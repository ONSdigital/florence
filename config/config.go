package config

import (
	"github.com/kelseyhightower/envconfig"
)

// Config represents the configuration required for florence
type Config struct {
	BindAddr           string `envconfig:"BIND_ADDR"`
	RouterURL          string `envconfig:"ROUTER_URL"`
	ZebedeeURL         string `envconfig:"ZEBEDEE_URL"`
	RecipeAPIURL       string `envconfig:"RECIPE_API_URL"`
	ImportAPIURL       string `envconfig:"IMPORT_API_URL"`
	DatasetAPIURL      string `envconfig:"DATASET_API_URL"`
	UploadBucketName   string `envconfig:"UPLOAD_BUCKET_NAME"`
	EnableNewApp       bool   `envconfig:"ENABLE_NEW_APP"`
	EncryptionDisabled bool   `envconfig:"ENCRYPTION_DISABLED"`
	VaultAddr          string `envconfig:"VAULT_ADDR"`
	VaultToken         string `envconfig:"VAULT_TOKEN"                json:"-"`
	VaultPath          string `envconfig:"VAULT_PATH"`
}

var cfg *Config

// Get retrieves the config from the environment for florence
func Get() (*Config, error) {
	if cfg != nil {
		return cfg, nil
	}

	cfg = &Config{
		BindAddr:           ":8080",
		RouterURL:          "http://localhost:20000",
		ZebedeeURL:         "http://localhost:8082",
		RecipeAPIURL:       "http://localhost:22300",
		ImportAPIURL:       "http://localhost:21800",
		DatasetAPIURL:      "http://localhost:22000",
		UploadBucketName:   "dp-frontend-florence-file-uploads",
		EnableNewApp:       false,
		EncryptionDisabled: false,
		VaultAddr:          "http://localhost:8200",
		VaultToken:         "",
		VaultPath:          "secret/shared/psk",
	}

	return cfg, envconfig.Process("", cfg)
}
