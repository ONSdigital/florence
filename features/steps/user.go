package steps

import (
	"context"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
	"github.com/pkg/errors"
	"net/http"
	"time"
)

type User interface {
	signIn(username string) error
	isSignedIn() bool
	signOut() error
	resetUser(fakeApi *FakeApi, ctx context.Context)
	setChromeCtx(ctx context.Context)
	setFakeApi(fakeApi *FakeApi)
	setAuthCookies()
}

func GenerateCookie(name, value, domain string) *http.Cookie {
	if domain == "" {
		domain = "localhost"
	}
	return &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		Domain:   domain,
		HttpOnly: true,
		Secure:   true,
		MaxAge:   0,
		SameSite: http.SameSiteStrictMode,
	}
}

func SetCookies(cookies ...*http.Cookie) chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		expr := cdp.TimeSinceEpoch(time.Now().Add(180 * 24 * time.Hour))
		for _, cookie := range cookies {
			err := network.SetCookie(cookie.Name, cookie.Value).
				WithExpires(&expr).
				WithDomain(cookie.Domain).
				WithPath(cookie.Path).
				WithHTTPOnly(cookie.HttpOnly).
				WithSecure(cookie.Secure).
				Do(ctx)
			if err != nil {
				return errors.New("set cookie error")
			}
		}
		return nil
	})
}
