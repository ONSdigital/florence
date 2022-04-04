package directors_test

import (
	"net/http"
	"testing"

	"github.com/ONSdigital/florence/directors"
	. "github.com/smartystreets/goconvey/convey"
)

func TestDirectorPrefixTrimming(t *testing.T) {

	Convey("Given a request to '/foo/bar'", t, func() {
		request, _ := http.NewRequest("GET", "/foo/bar", nil)

		Convey("When the Director is called with a prefix of '/foo'", func() {
			directors.Director("/foo")(request)

			Convey("Then the proxied request path should be '/bar'", func() {
				So(request.URL.String(), ShouldEqual, "/bar")
			})
		})

		Convey("When the Director is called with an empty string", func() {
			directors.Director("")(request)

			Convey("Then the proxied request path should be '/foo/bar'", func() {
				So(request.URL.String(), ShouldEqual, "/foo/bar")
			})
		})
	})
}

func TestDirectorCookieHandling(t *testing.T) {
	Convey("Given a request without any cookies set", t, func() {
		request, _ := http.NewRequest("GET", "/foo/bar", nil)

		Convey("When the Director is called", func() {
			directors.Director("")(request)

			Convey("Then the proxied request should not have the headers set", func() {
				_, hasFlorenceToken := request.Header["X-Florence-Token"]
				_, hasAuthorization := request.Header["Authorization"]
				_, hasCollectionID := request.Header["Collection-Id"]
				_, hasID := request.Header["ID"]
				_, hasRefresh := request.Header["Refresh"]

				So(hasFlorenceToken, ShouldBeFalse)
				So(hasAuthorization, ShouldBeFalse)
				So(hasCollectionID, ShouldBeFalse)
				So(hasID, ShouldBeFalse)
				So(hasRefresh, ShouldBeFalse)
			})
		})
	})

	Convey("Given a request with the 'access_token' cookie set", t, func() {
		cookie := http.Cookie{Name: "access_token", Value: "foo"}
		request, _ := http.NewRequest("GET", "", nil)
		request.AddCookie(&cookie)

		Convey("When Director is called", func() {
			directors.Director("")(request)

			Convey("Then the proxied request should have the 'X-Florence-Token' and 'Authorization' headers set", func() {
				So(request.Header.Get("X-Florence-Token"), ShouldEqual, "foo")
				So(request.Header.Get("Authorization"), ShouldEqual, "Bearer foo")
			})
		})
	})

	Convey("Given a request with the 'collection' cookie set", t, func() {
		cookie := http.Cookie{Name: "collection", Value: "foo"}
		request, _ := http.NewRequest("GET", "", nil)
		request.AddCookie(&cookie)

		Convey("When Director is called", func() {
			directors.Director("")(request)

			Convey("Then the proxied request should have the 'Collection-ID' header set", func() {
				So(request.Header.Get("Collection-ID"), ShouldEqual, "foo")
			})
		})
	})

	Convey("Given a request with the 'id_token' cookie set", t, func() {
		cookie := http.Cookie{Name: "id_token", Value: "foo"}
		request, _ := http.NewRequest("GET", "", nil)
		request.AddCookie(&cookie)

		Convey("When Director is called", func() {
			directors.Director("")(request)

			Convey("Then the proxied request should have the 'ID' header set", func() {
				So(request.Header.Get("ID"), ShouldEqual, "foo")
			})
		})
	})

	Convey("Given a request with the 'refresh_token' cookie set", t, func() {
		cookie := http.Cookie{Name: "refresh_token", Value: "foo"}
		request, _ := http.NewRequest("GET", "", nil)
		request.AddCookie(&cookie)

		Convey("When Director is called", func() {
			directors.Director("")(request)

			Convey("Then the proxied request should have the 'Refresh' header set", func() {
				So(request.Header.Get("Refresh"), ShouldEqual, "foo")
			})
		})
	})
}

func TestFixedVersionDirector(t *testing.T) {
	Convey("Given a request to '/foo/bar'", t, func() {
		request, _ := http.NewRequest("GET", "/foo/bar", nil)

		Convey("When the FixedVersionDirector is called with a version of 'v1'", func() {
			directors.FixedVersionDirector("v1", "")(request)

			Convey("Then the proxied request path should be '/v1/foo/bar'", func() {
				So(request.URL.String(), ShouldEqual, "/v1/foo/bar")
			})
		})
	})
}
