package modifiers

import (
	"net/http"
	"regexp"
	"time"

	dprequest "github.com/ONSdigital/dp-net/v2/request"
	"github.com/ONSdigital/log.go/log"
)

type Permission struct {
	Email  string `json:"email"`
	Admin  bool   `json:"admin"`
	Editor bool   `json:"editor"`
}

// Edits the response before proxying it back.
// If Auth tokens are present then set them as cookies
func IdentityResponseModifier(r *http.Response) error {
	if r.Request.Method == http.MethodDelete {
		// regex, may be /v1/tokens/self where value after 'v' could be any positive integer
		tokenSelfPathRegex := "^/v\\d+/tokens/self$"
		matched, err := regexp.MatchString(tokenSelfPathRegex, r.Request.URL.Path)
		if err != nil {
			log.Event(r.Request.Context(), "failed to run regex on request path", log.Error(err), log.ERROR)
		}
		if matched {
			// Attempt to delete cookies even if the response upstream was a fail
			deleteAuthCookies(r)
		}
	} else if r.StatusCode >= http.StatusOK && r.StatusCode < http.StatusMultipleChoices {
		setAuthCookies(r)
	}

	return nil
}

func setAuthCookies(r *http.Response) {
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
		r.Header.Add("Set-Cookie", userTokenCookie)
	}

	if r.Header.Get("Id") != "" {
		cookieId := &http.Cookie{
			Name:     "id_token",
			Value:    r.Header.Get("Id"),
			Path:     "/",
			Domain:   domain,
			HttpOnly: false,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
		}
		idTokenCookie := cookieId.String()
		r.Header.Add("Set-Cookie", idTokenCookie)
	}

	if r.Header.Get("Refresh") != "" {
		cookieRefresh := &http.Cookie{
			Name:     "refresh_token",
			Value:    r.Header.Get("Refresh"),
			Path:     "/tokens/self",
			Domain:   domain,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		}
		refreshTokenCookie := cookieRefresh.String()
		r.Header.Add("Set-Cookie", refreshTokenCookie)
	}
}
func deleteAuthCookies(r *http.Response) {
	// Expires all auth related tokens by replacing them
	cookieUser := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	}
	userTokenCookie := cookieUser.String()
	r.Header.Add("Set-Cookie", userTokenCookie)

	cookieId := &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/tokens/self",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	}
	idTokenCookie := cookieId.String()
	r.Header.Add("Set-Cookie", idTokenCookie)

	cookieRefresh := &http.Cookie{
		Name:     "id_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	}
	refreshTokenCookie := cookieRefresh.String()
	r.Header.Add("Set-Cookie", refreshTokenCookie)
}
