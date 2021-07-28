package service

import (
	. "github.com/smartystreets/goconvey/convey"
	"net/http"
	"strings"
	"testing"
)

func TestIdentityResponseModifier(t *testing.T) {

	Convey("Given a response that was successful and all headers are present, all 'set-cookie' headers should"+
		" be set", t, func() {
		initialHeaders := http.Header{
			"Authorization": []string{"foo"},
			"Id":            []string{"bar"},
			"Refresh":       []string{"baz"},
		}
		inBoundResponse := &http.Response{
			StatusCode: http.StatusCreated,
			Body:       nil,
			Header:     initialHeaders,
		}
		err := identityResponseModifier(inBoundResponse)
		cookieValues := inBoundResponse.Header.Values("Set-Cookie")
		var refreshTokenHeader string
		var idTokenHeader string
		var userAuthTokenHeader string
		for _, c := range cookieValues {
			if strings.Contains(c, "user_token") {
				userAuthTokenHeader = c
			}
			if strings.Contains(c, "refresh_token") {
				refreshTokenHeader = c
			}
			if strings.Contains(c, "id_token") {
				idTokenHeader = c
			}
		}

		So(err, ShouldBeNil)
		So(userAuthTokenHeader, ShouldEqual, "user_token=foo; Path=/; HttpOnly; Secure; SameSite=Strict")
		So(idTokenHeader, ShouldEqual, "id_token=bar; Path=/; Secure; SameSite=Lax")
		So(refreshTokenHeader, ShouldEqual, "refresh_token=baz; Path=/tokens/self; HttpOnly; Secure; SameSite=Strict")
	})
	Convey("Given a response that was unsuccessful do not set the set-cookie headers", t, func() {
		initialHeaders := http.Header{
			"Authorization": []string{"foo"},
			"Id":            []string{"bar"},
			"Refresh":       []string{"baz"},
		}
		inBoundResponse := &http.Response{
			StatusCode: http.StatusServiceUnavailable,
			Body:       nil,
			Header:     initialHeaders,
		}
		err := identityResponseModifier(inBoundResponse)
		cookieValues := inBoundResponse.Header.Values("Set-Cookie")
		So(err, ShouldBeNil)
		So(cookieValues, ShouldBeNil)
	})
}
