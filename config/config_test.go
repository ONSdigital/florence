package config

import (
	"os"
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
)

func TestGetRetrunsDefaultValues(t *testing.T) {
	t.Parallel()
	Convey("When a loading a configuration, default values are return", t, func() {
		os.Clearenv()
		configuration, err := Get()
		So(err, ShouldBeNil)
		So(configuration, ShouldResemble, &Config{
			BindAddr:             ":8080",
			APIRouterURL:         "http://localhost:23200",
			FrontendRouterURL:    "http://localhost:20000",
			DatasetControllerURL: "http://localhost:24000",
			TableRendererURL:     "http://localhost:23300",
			DataAdminURL:         "http://localhost:29400/data-admin",
			SharedConfig: SharedConfig{
				AllowedExternalPaths:    []string{},
				APIRouterVersion:        "v1",
				EnableCantabularJourney: false,
				EnableDataAdmin:         true,
				EnableMigrationField:    false,
				EnableNewUpload:         false,
				EnablePermissionsAPI:    false,
			},
			GracefulShutdownTimeout:    10 * time.Second,
			HealthCheckInterval:        30 * time.Second,
			HealthCheckCriticalTimeout: 90 * time.Second,
		})
	})
}
