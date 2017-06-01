package config

import (
	"os"
	"strconv"

	"github.com/ONSdigital/go-ns/log"
)

var (
	// BindAddr is the bind address
	BindAddr = ":8080"

	// BabbageURL is the URL for babbage
	BabbageURL = "http://localhost:8080"

	// ZebedeeURL is the URL for zebedee
	ZebedeeURL = "http://localhost:8082"

	// EnableNewApp controls whether the new React app is available
	EnableNewApp = false

	// ChaosPanda is the Chaos Panda
	ChaosPanda = struct {
		Enabled                 bool
		InternalServerErrorRate int
		ResponseDelayMaxMS      int
		ResponseDelayRate       int
	}{false, 0, 0, 0}
)

func init() {
	if v := os.Getenv("BIND_ADDR"); len(v) > 0 {
		BindAddr = v
	}
	if v := os.Getenv("BABBAGE_URL"); len(v) > 0 {
		BabbageURL = v
	}
	if v := os.Getenv("ZEBEDEE_URL"); len(v) > 0 {
		ZebedeeURL = v
	}
	if v := os.Getenv("ENABLE_NEW_APP"); len(v) > 0 {
		EnableNewApp, _ = strconv.ParseBool(v)
	}
	if v := os.Getenv("CHAOS_PANDA_ENABLED"); len(v) > 0 {
		ChaosPanda.Enabled, _ = strconv.ParseBool(v)
	}
	if v := os.Getenv("CHAOS_PANDA_INTERNAL_SERVER_ERROR_RATE"); len(v) > 0 {
		ChaosPanda.InternalServerErrorRate, _ = strconv.Atoi(v)
	}
	if v := os.Getenv("CHAOS_PANDA_RESPONSE_DELAY_RATE"); len(v) > 0 {
		ChaosPanda.ResponseDelayRate, _ = strconv.Atoi(v)
	}
	if v := os.Getenv("CHAOS_PANDA_RESPONSE_DELAY_MAX_MS"); len(v) > 0 {
		ChaosPanda.ResponseDelayMaxMS, _ = strconv.Atoi(v)
	}

	log.Debug("server config", log.Data{
		"bind_addr":      BindAddr,
		"babbage_url":    BabbageURL,
		"zebedee_url":    ZebedeeURL,
		"enable_new_app": EnableNewApp,
		"chaos_panda": log.Data{
			"enabled":                    ChaosPanda.Enabled,
			"internal_server_error_rate": ChaosPanda.InternalServerErrorRate,
			"response_delay_rate":        ChaosPanda.ResponseDelayRate,
			"response_delay_max_ms":      ChaosPanda.ResponseDelayMaxMS,
		},
	})
}
