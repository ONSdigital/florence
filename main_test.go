package main

import (
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/ONSdigital/florence/assets"
	. "github.com/smartystreets/goconvey/convey"
)

func TestMain(t *testing.T) {
	Convey("Returns 200 when asset is requested", t, func() {
		recorder := httptest.NewRecorder()
		request, err := http.NewRequest("GET", "/florence/dist/js/app.bundle.js", nil)
		request.URL.RawQuery = ":uri=js/app.bundle.js"
		So(err, ShouldBeNil)
		request.Header.Set("Accept-Language", "en")
		staticFiles(recorder, request)
		So(recorder.Code, ShouldEqual, 200)
	})

	Convey("Returns 404 when an unrecognised asset path is given", t, func() {
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "/florence/dist/foo", rdr)
		request.URL.RawQuery = ":uri=foo"
		So(err, ShouldBeNil)
		request.Header.Set("Accept-Language", "en")
		staticFiles(recorder, request)
		So(recorder.Code, ShouldEqual, 404)
	})

	Convey("Request for legacy HTML file returns a 200 response", t, func() {
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)
		request.Header.Set("Accept-Language", "en")
		legacyIndexFile(recorder, request)
		So(recorder.Code, ShouldEqual, 200)
	})

	Convey("Request for missing legacy HTML file returns a 404", t, func() {
		getAsset = func(path string) ([]byte, error) {
			return nil, errors.New("Legacy HTML file not found")
		}
		defer func() {
			getAsset = assets.Asset
		}()
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)
		request.Header.Set("Accept-Language", "en")
		legacyIndexFile(recorder, request)
		So(recorder.Code, ShouldEqual, 404)
	})

	Convey("Request for refactored HTML file returns a 200 response", t, func() {
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)
		request.Header.Set("Accept-Language", "en")
		refactoredIndexFile(recorder, request)
		So(recorder.Code, ShouldEqual, 200)
	})

	Convey("Request for missing refactored HTML file returns a 404", t, func() {
		getAsset = func(path string) ([]byte, error) {
			return nil, errors.New("Refactored HTML file not found")
		}
		defer func() {
			getAsset = assets.Asset
		}()
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)
		request.Header.Set("Accept-Language", "en")
		refactoredIndexFile(recorder, request)
		So(recorder.Code, ShouldEqual, 404)
	})

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
		cookie := http.Cookie{"access_token", "foo", "/", "http://localhost", time.Now().AddDate(0, 0, 1), time.Now().AddDate(0, 0, 1).Format(time.UnixDate), 0, false, true, "access_token=foo", []string{"access_token=foo"}}
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
}
