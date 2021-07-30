package service

import (
	"fmt"
	"github.com/ONSdigital/log.go/log"
	"net/http"
	"strings"

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

	if colletionCookie, err := req.Cookie(dprequest.CollectionIDCookieKey); err == nil && len(colletionCookie.Value) > 0 {
		headers.SetCollectionID(req, colletionCookie.Value)
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
	}
}

func uploadServiceAPIDirector(apiRouterVersion string) func(req *http.Request) {
	return func(req *http.Request) {
		director(req)
		req.URL.Path = fmt.Sprintf("/%s%s", apiRouterVersion, req.URL.Path)
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

func datasetControllerDirector(req *http.Request) {
	director(req)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/dataset-controller")
}

func tableDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/table")
}
