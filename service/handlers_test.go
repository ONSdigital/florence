package service

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/ONSdigital/florence/assets"
	"github.com/ONSdigital/florence/config"
	. "github.com/smartystreets/goconvey/convey"
)

var mockHTMLFile = `
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

func TestStaticFiles(t *testing.T) {

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
}

func TestIndexFile(t *testing.T) {

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
				EnableDatasetImport:  true,
				EnableNewSignIn:      true,
				EnableNewUpload:      true,
				EnablePermissionsAPI: true,
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
			So(strings.Contains(html, `/* server generated shared config */ {"enableDatasetImport":true,"enableNewSignIn":true,"enableNewUpload":true,"enablePermissionsAPI":true}`), ShouldBeTrue)
		})

		Convey("Shared config written into refactored HTML contains the correct config", func() {
			handler := http.HandlerFunc(refactoredIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
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
			So(strings.Contains(html, `/* server generated shared config */ {"enableDatasetImport":false,"enableNewSignIn":false,"enableNewUpload":false,"enablePermissionsAPI":false}`), ShouldBeTrue)

		})

		Convey("Shared config written into refactored HTML contains the correct config", func() {
			handler := http.HandlerFunc(refactoredIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, `/* server generated shared config */ {"enableDatasetImport":false,"enableNewSignIn":false,"enableNewUpload":false,"enablePermissionsAPI":false}`), ShouldBeTrue)
		})

	})
}
