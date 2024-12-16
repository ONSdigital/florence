package service

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/mux"

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
		req, err := http.NewRequest("GET", "/florence/dist/js/app.bundle.js", nil)
		So(err, ShouldBeNil)
		req.Header.Set("Accept-Language", "en")

		router := mux.NewRouter()
		router.HandleFunc("/florence/dist/{uri:.*}", func(writer http.ResponseWriter, request *http.Request) {
			staticFiles(recorder, request)
			So(recorder.Code, ShouldEqual, 200)
		})
		router.ServeHTTP(recorder, req)
	})

	Convey("Returns 404 when an unrecognised asset path is given", t, func() {
		recorder := httptest.NewRecorder()
		rdr := bytes.NewReader([]byte(``))
		req, err := http.NewRequest("GET", "/florence/dist/foo", rdr)
		So(err, ShouldBeNil)
		req.Header.Set("Accept-Language", "en")

		router := mux.NewRouter()
		router.HandleFunc("/florence/dist/{uri:.*}", func(writer http.ResponseWriter, request *http.Request) {
			staticFiles(recorder, request)
			So(recorder.Code, ShouldEqual, 404)
		})
		router.ServeHTTP(recorder, req)
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
				AllowedExternalPaths: []string{
					"/test/path",
					"/another/test/path",
				},
				EnableNewUpload:         true,
				EnablePermissionsAPI:    true,
				EnableCantabularJourney: true,
				EnableDataAdmin:         true,
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
			So(strings.Contains(html, `/* server generated shared config */ {"allowedExternalPaths":["/test/path","/another/test/path"],"enableDatasetImport":true,"enableNewUpload":true,"enablePermissionsAPI":true,"enableCantabularJourney":true,"enableDataAdmin":true}`), ShouldBeTrue)
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
			So(strings.Contains(html, `/* server generated shared config */ {"allowedExternalPaths":null,"enableDatasetImport":false,"enableNewUpload":false,"enablePermissionsAPI":false,"enableCantabularJourney":false,"enableDataAdmin":false}`), ShouldBeTrue)

		})

		Convey("Shared config written into refactored HTML contains the correct config", func() {
			handler := http.HandlerFunc(refactoredIndexFile(cfg))
			handler.ServeHTTP(recorder, request)
			body, err := ioutil.ReadAll(recorder.Body)
			So(err, ShouldBeNil)
			html := string(body)
			So(strings.Contains(html, "/* environment variables placeholder */"), ShouldBeFalse)
			So(strings.Contains(html, `/* server generated shared config */ {"allowedExternalPaths":null,"enableDatasetImport":false,"enableNewUpload":false,"enablePermissionsAPI":false,"enableCantabularJourney":false,"enableDataAdmin":false}`), ShouldBeTrue)
		})

	})
}
