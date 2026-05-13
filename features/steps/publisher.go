package steps

import (
	"context"
	"net/http"

	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

const (
	cookieAccessToken  = "access_token"
	cookieIDToken      = "id_token"
	cookieRefreshToken = "refresh_token"
	defaultDomain      = "localhost"
)

type Publisher struct {
	fakeAPI   *FakeAPI
	chromeCtx context.Context
	cookies   []*network.Cookie
}

func NewPublisher(api *FakeAPI, ctx context.Context) *Publisher {
	return &Publisher{fakeAPI: api, chromeCtx: ctx}
}

func generateAuthCookies() []*http.Cookie {
	return []*http.Cookie{
		GenerateCookie(cookieAccessToken, "fakeAuthorizationToken", "", "/", true),
		GenerateCookie(cookieIDToken, "fakeIDToken", "", "/", false),
		GenerateCookie(cookieRefreshToken, "fakeRefreshToken", "", "/tokens/self", true),
	}
}

func (p *Publisher) signIn(username string) error {
	var cookies []*http.Cookie

	switch username {
	case "not.a.user@ons.gov.uk":
		p.fakeAPI.setJSONResponseForPost("/tokens", "", 401)
	case "":
		p.fakeAPI.fakeHTTP.NewHandler().Post("/tokens").Reply(400).Body([]byte(`{"errors": [{"code": "InvalidEmail","description": "the submitted email could not be validated"}]}`))
	case "no.password@ons.gov.uk":
		p.fakeAPI.fakeHTTP.NewHandler().Post("/tokens").Reply(400).Body([]byte(`{"errors": [{"code": "InvalidPassword","description": "the submitted password could not be validated"}]}`))
	default:
		p.fakeAPI.setJSONResponseForPost("/tokens", "{\"expirationTime\": \"2020-01-01 00-00-01Z\"}", 200)
		cookies = generateAuthCookies()
	}

	err := chromedp.Run(p.chromeCtx,
		SetCookies(cookies),
		chromedp.Navigate("http://localhost:8080/florence/login"),
		chromedp.WaitVisible(`#app`),
		chromedp.SendKeys("#email", username),
		chromedp.SendKeys("#password", "anything"),
		chromedp.Click(".form button"),
		p.readResponseCookies(),
	)

	if err != nil {
		return err
	}

	return nil
}

func (p *Publisher) signOut() {
	p.cookies = nil
}

func (p *Publisher) readResponseCookies() chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		cookies, err := network.GetCookies().Do(ctx)
		if err != nil {
			return err
		}
		p.cookies = cookies
		return nil
	})
}

func (p *Publisher) setAuthCookies() {
	p.cookies = append(p.cookies,
		&network.Cookie{
			Name:   cookieAccessToken,
			Value:  "fakeAuthorizationToken",
			Domain: defaultDomain,
			Path:   "/",
		},
		&network.Cookie{
			Name:   cookieIDToken,
			Value:  "fakeIDToken",
			Domain: defaultDomain,
			Path:   "/",
		},
		&network.Cookie{
			Name:   cookieRefreshToken,
			Value:  "fakeRefreshToken",
			Domain: defaultDomain,
			Path:   "/",
		},
	)
}

func (p *Publisher) isSignedIn() bool {
	for _, cookie := range p.cookies {
		if cookie.Name == cookieAccessToken {
			return true
		}
	}
	return false
}

func (p *Publisher) resetUser(fakeAPI *FakeAPI, ctx context.Context) {
	p.fakeAPI = fakeAPI
	p.chromeCtx = ctx
}

func (p *Publisher) setChromeCtx(ctx context.Context) {
	p.chromeCtx = ctx
}

func (p *Publisher) setFakeAPI(fakeAPI *FakeAPI) {
	p.fakeAPI = fakeAPI
}
