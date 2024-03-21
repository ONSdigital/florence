package directors

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/ONSdigital/dp-cookies/cookies"
	"github.com/ONSdigital/log.go/log"

	"github.com/ONSdigital/dp-api-clients-go/v2/headers"
	dprequest "github.com/ONSdigital/dp-net/v2/request"
)

// Director sets the appropriate headers and rewrites the request path to remove the prefix if provided.
//
// The path rewrite will remove the prefix from the inbound request path.
//
// For example, if the `pathPrefix` is `/api` then a request is made to:
//
//	"POST /api/v1/tokens"
//
// will be proxied to:
//
//	"POST /v1/tokens"
func Director(pathPrefix string) func(req *http.Request) {
	return func(req *http.Request) {
		setHeaders(req)
		req.URL.Path = fmt.Sprintf("%s", strings.TrimPrefix(req.URL.Path, pathPrefix))
	}
}

// FixedVersionDirector wraps the director(pathPrefix) function and prepends a fixed API version (e.g. `/v1`).
//
// This function should not be used as it couples all calls from the JavaScript to the API to the same API version.
// It is best to instead include the API version in path used by the JavaScript client. Including the version in the
// client allows us to slowly update screens/clients to use new API versions rather than requiring a big bang approach.
//
// Deprecated: use director(pathPrefix) function instead.
func FixedVersionDirector(apiRouterVersion string, pathPrefix string) func(req *http.Request) {
	directorFunc := Director(pathPrefix)

	return func(req *http.Request) {
		directorFunc(req)

		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, req.URL.Path)
	}
}

func setHeaders(req *http.Request) {
	if accessTokenCookie, err := req.Cookie(dprequest.FlorenceCookieKey); err == nil && len(accessTokenCookie.Value) > 0 {
		err := headers.SetAuthToken(req, accessTokenCookie.Value)
		if err != nil {
			log.Event(req.Context(), "unable to set auth token header", log.Error(err), log.ERROR)
		}
	}

	if collectionCookie, err := req.Cookie(dprequest.CollectionIDCookieKey); err == nil && len(collectionCookie.Value) > 0 {
		if err := headers.SetCollectionID(req, collectionCookie.Value); err != nil {
			log.Event(req.Context(), "unable to collection id header", log.Error(err), log.ERROR)
		}
	}

	if idToken, err := cookies.GetIDToken(req); err == nil && len(idToken) > 0 {
		if err := headers.SetIDTokenHeader(req, idToken); err != nil {
			log.Event(req.Context(), "unable to set id token header", log.Error(err), log.ERROR)
		}
	}

	if refreshToken, err := cookies.GetRefreshToken(req); err == nil && len(refreshToken) > 0 {
		if err := headers.SetRefreshTokenHeader(req, refreshToken); err != nil {
			log.Event(req.Context(), "unable to set refresh token header", log.Error(err), log.ERROR)
		}
	}

	if req.URL.Path == "/groups-report" {
		if err := headers.SetAccept(req, "text/csv"); err != nil {
			log.Event(req.Context(), "unable to set accept header", log.Error(err), log.ERROR)
		}
	}

}
