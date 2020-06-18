package main

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	. "github.com/smartystreets/goconvey/convey"
)

func TestMain(t *testing.T) {
	mockHTMLFile := `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Florence</title>
	
		<link rel="stylesheet" href="/florence/dist/css/app.css">
	</head>
	<body>
	<noscript><h1>Enable Javascript to use Florence</h1></noscript>
	<script>
		function getEnv() {
		  return /* environment variables placeholder */
		}
	</script>
	<div id="app"></div>
	
	<!-- We're using an external version of ResumableJS (from http://www.resumablejs.com/) and not importing it via NPM
		because the NPM module appears to be out-of-date and breaks our code. -->
	<script type="text/javascript" src="https://cdn.ons.gov.uk/vendor/resumable-js/1.0.0/resumable.js"></script>
	
	<script type="text/javascript" src="/florence/dist/js/app.bundle.js"></script>
	</body>
	</html>
	`

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
		cfg := &config.Config{}
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)
		handler := http.HandlerFunc(legacyIndexFile(cfg))
		handler.ServeHTTP(recorder, request)
		So(recorder.Code, ShouldEqual, 200)
	})

	Convey("Request for missing legacy HTML file returns a 404", t, func() {
		cfg := &config.Config{}
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
		handler := http.HandlerFunc(legacyIndexFile(cfg))
		handler.ServeHTTP(recorder, request)
		So(recorder.Code, ShouldEqual, 404)
	})

	Convey("Request for refactored HTML file returns a 200 response", t, func() {
		cfg := &config.Config{}
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)
		handler := http.HandlerFunc(refactoredIndexFile(cfg))
		handler.ServeHTTP(recorder, request)
		So(recorder.Code, ShouldEqual, 200)
	})

	Convey("Request for missing refactored HTML file returns a 404", t, func() {
		cfg := &config.Config{}
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
		handler := http.HandlerFunc(refactoredIndexFile(cfg))
		handler.ServeHTTP(recorder, request)
		So(recorder.Code, ShouldEqual, 404)
	})

	Convey("The shared config variables", t, func() {
		getAsset = func(path string) ([]byte, error) {
			return []byte(mockHTMLFile), nil
		}

		Convey("Replaces placeholder in refactored HTML file", func() {
			getAsset = func(path string) ([]byte, error) {
				return []byte(mockHTMLFile), nil
			}
			cfg := &config.Config{}
			recorder := httptest.NewRecorder()
			rdr := bytes.NewReader([]byte(``))
			request, err := http.NewRequest("GET", "", rdr)
			So(err, ShouldBeNil)
			handler := http.HandlerFunc(refactoredIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, "/* server generated shared config */"), ShouldBeTrue)
		})

		Convey("Replaces placeholder in legacy HTML file", func() {
			getAsset = func(path string) ([]byte, error) {
				return []byte(mockHTMLFile), nil
			}
			cfg := &config.Config{}
			recorder := httptest.NewRecorder()
			rdr := bytes.NewReader([]byte(``))
			request, err := http.NewRequest("GET", "", rdr)
			So(err, ShouldBeNil)
			handler := http.HandlerFunc(legacyIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, "/* server generated shared config */"), ShouldBeTrue)
		})

		Convey("Returns original HTML if placeholder isn't present", func() {
			HTMLFile := `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Florence</title>
			
				<link rel="stylesheet" href="/florence/dist/css/app.css">
			</head>
			<body>
			<noscript><h1>Enable Javascript to use Florence</h1></noscript>
			<div id="app"></div>
			
			<!-- We're using an external version of ResumableJS (from http://www.resumablejs.com/) and not importing it via NPM
				because the NPM module appears to be out-of-date and breaks our code. -->
			<script type="text/javascript" src="https://cdn.ons.gov.uk/vendor/resumable-js/1.0.0/resumable.js"></script>
			
			<script type="text/javascript" src="/florence/dist/js/app.bundle.js"></script>
			</body>
			</html>
			`
			getAsset = func(path string) ([]byte, error) {
				return []byte(HTMLFile), nil
			}
			cfg := &config.Config{}
			recorder := httptest.NewRecorder()
			rdr := bytes.NewReader([]byte(``))
			request, err := http.NewRequest("GET", "", rdr)
			So(err, ShouldBeNil)
			handler := http.HandlerFunc(legacyIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			So(string(body), ShouldEqual, HTMLFile)
		})
	})

	Convey("Environment variables are set", t, func() {
		cfg := &config.Config{
			SharedConfig: config.SharedConfig{
				EnableDatasetImport:      true,
				EnableHomepagePublishing: true,
			},
		}
		getAsset = func(path string) ([]byte, error) {
			return []byte(mockHTMLFile), nil
		}

		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)

		Convey("Shared config written into legacy HTML contains the correct config", func() {
			handler := http.HandlerFunc(legacyIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, `/* server generated shared config */ {"enableDatasetImport":true,"enableHomepagePublishing":true}`), ShouldBeTrue)
		})

		Convey("Shared config written into refactored HTML contains the correct config", func() {
			handler := http.HandlerFunc(refactoredIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, `/* server generated shared config */ {"enableDatasetImport":true,"enableHomepagePublishing":true}`), ShouldBeTrue)
		})

	})

	Convey("No environment variables are set", t, func() {
		cfg := &config.Config{}

		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		request, err := http.NewRequest("GET", "", rdr)
		So(err, ShouldBeNil)

		Convey("Shared config written into legacy HTML contains the correct config", func() {
			handler := http.HandlerFunc(legacyIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, `/* server generated shared config */ {"enableDatasetImport":false,"enableHomepagePublishing":false}`), ShouldBeTrue)

		})

		Convey("Shared config written into refactored HTML contains the correct config", func() {
			handler := http.HandlerFunc(refactoredIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, `/* server generated shared config */ {"enableDatasetImport":false,"enableHomepagePublishing":false}`), ShouldBeTrue)
		})

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
}
