package service

import (
	"net/http"
)

// Edits the response before proxying it back.
// If Auth tokens are present then set them as cookies
func identityResponseModifier(r *http.Response) error {
	// maxAgeBrowserSession is length of time to expire cookie on browser close
	maxAgeBrowserSession := 0
	if r.StatusCode >= 200 && r.StatusCode < 300 {
		if r.Header.Get("Authorization") != "" {
			cookieUser := &http.Cookie{
				Name:     "user_token",
				Value:    r.Header.Get("Authorization"),
				Path:     "/",
				Domain:   "",
				HttpOnly: true,
				Secure:   true,
				MaxAge:   maxAgeBrowserSession,
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
				Domain:   "",
				HttpOnly: false,
				Secure:   true,
				MaxAge:   maxAgeBrowserSession,
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
				Domain:   "",
				HttpOnly: true,
				Secure:   true,
				MaxAge:   maxAgeBrowserSession,
				SameSite: http.SameSiteStrictMode,
			}
			refreshTokenCookie := cookieRefresh.String()
			r.Header.Add("Set-Cookie", refreshTokenCookie)

		}
	}
	return nil
}
