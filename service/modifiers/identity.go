package modifiers

import (
	"fmt"
	"net/http"
	"regexp"
	"time"

	dprequest "github.com/ONSdigital/dp-net/v3/request"
)

const (
	cookieIDToken      = "id_token"
	cookieRefreshToken = "refresh_token"
	headerSetCookie    = "Set-Cookie"
)

type Permission struct {
	Email  string `json:"email"`
	Admin  bool   `json:"admin"`
	Editor bool   `json:"editor"`
}

// Edits the response before proxying it back.
// If Auth tokens are present then set them as cookies
func IdentityResponseModifier(apiRouterVersion string) func(r *http.Response) error {
	refreshTokenPath := fmt.Sprintf("/api/%s/tokens/self", apiRouterVersion)

	return func(r *http.Response) error {
		if r.Request.Method == http.MethodDelete {
			// regex, may be /v1/tokens/self where value after 'v' could be any positive integer
			tokenSelfPathRegex := regexp.MustCompile(`^/v\d+/tokens/self$`)
			matched := tokenSelfPathRegex.MatchString(r.Request.URL.Path)
			if matched {
				// Attempt to delete cookies even if the response upstream was a fail
				deleteAuthCookies(r, refreshTokenPath)
			}
		} else if r.StatusCode >= http.StatusOK && r.StatusCode < http.StatusMultipleChoices {
			setAuthCookies(r, refreshTokenPath)
		}

		return nil
	}
}

func setAuthCookies(r *http.Response, refreshTokenPath string) {
	domain := r.Request.Header.Get("X-Forwarded-Host")
	if r.Header.Get("Authorization") != "" {
		cookieUser := &http.Cookie{
			Name:     dprequest.FlorenceCookieKey,
			Value:    r.Header.Get("Authorization"),
			Path:     "/",
			Domain:   domain,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		}
		userTokenCookie := cookieUser.String()
		r.Header.Add(headerSetCookie, userTokenCookie)
	}

	if r.Header.Get("Id") != "" {
		cookieID := &http.Cookie{ //nolint:gosec // id_token needs JS access for client-side auth
			Name:     cookieIDToken,
			Value:    r.Header.Get("Id"),
			Path:     "/",
			Domain:   domain,
			HttpOnly: false,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
		}
		idTokenCookie := cookieID.String()
		r.Header.Add(headerSetCookie, idTokenCookie)
	}

	if r.Header.Get("Refresh") != "" {
		cookieRefresh := &http.Cookie{
			Name:     cookieRefreshToken,
			Value:    r.Header.Get("Refresh"),
			Path:     refreshTokenPath,
			Domain:   domain,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		}
		refreshTokenCookie := cookieRefresh.String()
		r.Header.Add(headerSetCookie, refreshTokenCookie)
	}
}
func deleteAuthCookies(r *http.Response, refreshTokenPath string) {
	domain := r.Request.Header.Get("X-Forwarded-Host")

	// Expires all auth related tokens by replacing them
	cookieUser := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Domain:   domain,
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	}
	userTokenCookie := cookieUser.String()
	r.Header.Add(headerSetCookie, userTokenCookie)

	cookieID := &http.Cookie{
		Name:     cookieRefreshToken,
		Value:    "",
		Path:     refreshTokenPath,
		Domain:   domain,
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	}
	idTokenCookie := cookieID.String()
	r.Header.Add(headerSetCookie, idTokenCookie)

	cookieRefresh := &http.Cookie{
		Name:     cookieIDToken,
		Value:    "",
		Path:     "/",
		Domain:   domain,
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	refreshTokenCookie := cookieRefresh.String()
	r.Header.Add(headerSetCookie, refreshTokenCookie)
}
