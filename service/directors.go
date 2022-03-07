package service

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/ONSdigital/dp-cookies/cookies"
	"github.com/ONSdigital/log.go/log"

	"github.com/ONSdigital/dp-api-clients-go/v2/headers"
	dprequest "github.com/ONSdigital/dp-net/v2/request"
)

func director(req *http.Request) {
	if accessTokenCookie, err := req.Cookie(dprequest.FlorenceCookieKey); err == nil && len(accessTokenCookie.Value) > 0 {
		err := headers.SetAuthToken(req, accessTokenCookie.Value)
		if err != nil {
			log.Event(req.Context(), "unable to set auth token header", log.Error(err), log.ERROR)
		}
	}

	if collectionCookie, err := req.Cookie(dprequest.CollectionIDCookieKey); err == nil && len(collectionCookie.Value) > 0 {
		headers.SetCollectionID(req, collectionCookie.Value)
	}
}

func zebedeeDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/zebedee")
}

func recipeAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, req.URL.Path)
	}
}

func identityAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, req.URL.Path)
		// regex, may be /v1/tokens/self where value after 'v' could be any positive integer
		refreshPathRegex := "^/v\\d+/tokens/self$"
		matched, err := regexp.MatchString(refreshPathRegex, req.URL.Path)
		if err != nil {
			log.Event(req.Context(), "failed to run regex on request path", log.Error(err), log.ERROR)
		}
		if matched {
			if idToken, err := cookies.GetIDToken(req); err == nil && len(idToken) > 0 {
				err := headers.SetIDTokenHeader(req, idToken)
				if err != nil {
					log.Event(req.Context(), "unable to set id token header", log.Error(err), log.ERROR)
				}
			}
			if refreshToken, err := cookies.GetRefreshToken(req); err == nil && len(refreshToken) > 0 {
				err := headers.SetRefreshTokenHeader(req, refreshToken)
				if err != nil {
					log.Event(req.Context(), "unable to set refresh token header", log.Error(err), log.ERROR)
				}
			}
		}
	}
}

func uploadServiceAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, req.URL.Path)
	}
}

func filesAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, strings.TrimPrefix(req.URL.Path, "/files"))
	}
}

func importAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, strings.TrimPrefix(req.URL.Path, "/import"))
	}
}

func datasetAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, strings.TrimPrefix(req.URL.Path, "/dataset"))
	}
}

func imageAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, strings.TrimPrefix(req.URL.Path, "/image"))
	}
}

func topicAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, req.URL.Path)
	}
}

func datasetControllerDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/dataset-controller")
}

func tableDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/table")
}
