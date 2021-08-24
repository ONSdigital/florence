package service

import (
	"net/http"
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
)

func TestDirectors(t *testing.T) {

	Convey("Table renderer proxy director function trims '/table' from the request URL", t, func() {
		request, err := http.NewRequest("GET", "/table/parse", nil)
		So(err, ShouldBeNil)
		tableDirector(request)
		So(request.URL.String(), ShouldEqual, "/parse")
	})

	Convey("Zebedee proxy director function trims '/zebedee' from the request URL", t, func() {
		request, err := http.NewRequest("GET", "/zebedee/test", nil)
		So(err, ShouldBeNil)
		zebedeeDirector(request)
		So(request.URL.String(), ShouldEqual, "/test")
	})

	Convey("Zebedee proxy director function sets 'X-Florence-Token' header when access_token cookie is available", t, func() {
		cookie := http.Cookie{"access_token", "foo", "/", "http://localhost", time.Now().AddDate(0, 0, 1), time.Now().AddDate(0, 0, 1).Format(time.UnixDate), 0, false, true, http.SameSiteDefaultMode, "access_token=foo", []string{"access_token=foo"}}
		request, err := http.NewRequest("GET", "", nil)
		So(err, ShouldBeNil)
		request.AddCookie(&cookie)
		zebedeeDirector(request)
		So(request.Header.Get("X-Florence-Token"), ShouldEqual, "foo")
	})

	Convey("Zebedee proxy director function doesn't set 'X-Florence-Token' header when no access_token cookie is available", t, func() {
		request, err := http.NewRequest("GET", "", nil)
		So(err, ShouldBeNil)
		zebedeeDirector(request)
		So(request.Header.Get("X-Florence-Token"), ShouldBeBlank)
	})

	Convey("Dataset Controller proxy director function trims 'dataset-controller' from the request URL", t, func() {
		request, err := http.NewRequest("GET", "/dataset-controller/bar", nil)
		So(err, ShouldBeNil)
		datasetControllerDirector(request)
		So(request.URL.String(), ShouldEqual, "/bar")
	})

	Convey("Recipe API proxy director function appends the provided router api version to the provided path", t, func() {
		request, err := http.NewRequest("GET", "/foo", nil)
		So(err, ShouldBeNil)
		recipeAPIDirector("v123")(request)
		So(request.URL.String(), ShouldEqual, "/v123/foo")
	})

	Convey("Import API proxy director function appends the provided router api version to the provided path and trims '/import' from the request URL", t, func() {
		request, err := http.NewRequest("GET", "/import/bar", nil)
		So(err, ShouldBeNil)
		importAPIDirector("v123")(request)
		So(request.URL.String(), ShouldEqual, "/v123/bar")
	})

	Convey("Dataset API proxy director function appends the provided router api version to the provided path and trims '/dataset' from the request URL", t, func() {
		request, err := http.NewRequest("GET", "/dataset/foo", nil)
		So(err, ShouldBeNil)
		datasetAPIDirector("v123")(request)
		So(request.URL.String(), ShouldEqual, "/v123/foo")
	})

	Convey("UploadService API proxy director function appends the provided router api version to the provided path' from the request URL", t, func() {
		request, err := http.NewRequest("GET", "/foo", nil)
		So(err, ShouldBeNil)
		uploadServiceAPIDirector("v123")(request)
		So(request.URL.String(), ShouldEqual, "/v123/foo")
	})

	Convey("Identity API proxy director function appends the provided router api version to the provided path' from the request URL", t, func() {
		request, err := http.NewRequest("GET", "/foo", nil)
		So(err, ShouldBeNil)
		identityAPIDirector("v123")(request)
		So(request.URL.String(), ShouldEqual, "/v123/foo")
	})

	Convey("Identity API proxy director function sets the refresh headers correctly", t, func() {
		request, err := http.NewRequest("GET", "/tokens/self", nil)
		So(err, ShouldBeNil)
		idTokenValue := "foo"
		refreshTokenValue := "bar"
		idCookie := http.Cookie{Name: "id_token", Value: idTokenValue}
		refreshCookie := http.Cookie{Name: "refresh_token", Value: refreshTokenValue}
		request.AddCookie(&idCookie)
		request.AddCookie(&refreshCookie)
		identityAPIDirector("v1")(request)
		idHeaderValue := request.Header.Get("ID")
		refreshHeaderValue := request.Header.Get("Refresh")
		So(idHeaderValue, ShouldEqual, idTokenValue)
		So(refreshHeaderValue, ShouldEqual, refreshTokenValue)
	})
}
