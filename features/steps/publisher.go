package steps

import (
	"context"
	"net/http"

	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

type Publisher struct {
	fakeApi   *FakeApi
	chromeCtx context.Context
	cookies   []*network.Cookie
}

func NewPublisher(api *FakeApi, ctx context.Context) *Publisher {
	return &Publisher{fakeApi: api, chromeCtx: ctx}
}

func generateAuthCookies() []*http.Cookie {
	return []*http.Cookie{
		GenerateCookie("access_token", "fakeAuthorizationToken", "", "/", true),
		GenerateCookie("id_token", "fakeIDToken", "", "/", false),
		GenerateCookie("refresh_token", "fakeRefreshToken", "", "/tokens/self", true),
	}
}

func (p *Publisher) signIn(username string) error {
	var cookies []*http.Cookie

	if username == "not.a.user@ons.gov.uk" {
		p.fakeApi.setJsonResponseForPost("/tokens", "", 401)
	} else if username == "" {
		p.fakeApi.fakeHttp.NewHandler().Post("/tokens").Reply(400).Body([]byte(`{"errors": [{"code": "InvalidEmail","description": "the submitted email could not be validated"}]}`))
	} else if username == "no.password@ons.gov.uk" {
		p.fakeApi.fakeHttp.NewHandler().Post("/tokens").Reply(400).Body([]byte(`{"errors": [{"code": "InvalidPassword","description": "the submitted password could not be validated"}]}`))
	} else {
		p.fakeApi.setJsonResponseForPost("/tokens", "{\"expirationTime\": \"2020-01-01 00-00-01Z\"}", 200)
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

func (p *Publisher) signOut() error {
	p.fakeApi.setJsonResponseForDelete("/tokens", "", 200)

	// Florence backend is currently not removing the auth cookies so will be returned in the response
	// asa a result the sign out functionality will currently fail tests
	cookies := generateAuthCookies()

	err := chromedp.Run(p.chromeCtx,
		SetCookies(cookies),
		chromedp.Navigate("http://localhost:8080/florence"),
		chromedp.WaitVisible(`#app`),
		chromedp.Click(".global-nav__link:last-of-type"),
		p.readResponseCookies(),
	)

	if err != nil {
		return err
	}

	return nil
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
	p.cookies = append(p.cookies, &network.Cookie{
		Name:   "access_token",
		Value:  "fakeAuthorizationToken",
		Domain: "localhost",
		Path:   "/",
	})
	p.cookies = append(p.cookies, &network.Cookie{
		Name:   "id_token",
		Value:  "fakeIDToken",
		Domain: "localhost",
		Path:   "/",
	})
	p.cookies = append(p.cookies, &network.Cookie{
		Name:   "refresh_token",
		Value:  "fakeRefreshToken",
		Domain: "localhost",
		Path:   "/",
	})
}

func (p *Publisher) isSignedIn() bool {
	for _, cookie := range p.cookies {
		if cookie.Name == "access_token" {
			return true
		}
	}
	return false
}

func (p *Publisher) resetUser(fakeApi *FakeApi, ctx context.Context) {
	p.fakeApi = fakeApi
	p.chromeCtx = ctx
}

func (p *Publisher) setChromeCtx(ctx context.Context) {
	p.chromeCtx = ctx
}

func (p *Publisher) setFakeApi(fakeApi *FakeApi) {
	p.fakeApi = fakeApi
}
