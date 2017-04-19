package main

import (
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ONSdigital/florence/assets"
	. "github.com/smartystreets/goconvey/convey"
)

func TestMain(t *testing.T) {
	Convey("Returns 200 when asset is requested", t, func() {
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "/florence/dist/js/florence.bundle.js", rdr)
		request.URL.RawQuery = ":uri=js/florence.bundle.js"
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
}
