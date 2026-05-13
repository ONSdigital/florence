package config

import (
	"os"
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
)

func TestGetReturnsDefaultValues(t *testing.T) {
	t.Parallel()
	Convey("When a loading a configuration, default values are returned", t, func() {
		os.Clearenv()
		configuration, err := Get()
		So(err, ShouldBeNil)
		So(configuration, ShouldResemble, &Config{
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
		})
	})
}
