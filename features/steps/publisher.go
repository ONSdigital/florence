package steps

import (
	"context"
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

func (p *Publisher) signIn(username string) error {
	cookieUser := GenerateCookie("user_token", "fakeAuthorizationToken", "")
	cookieId := GenerateCookie("id_token", "fakeIDToken", "")
	cookieRefresh := GenerateCookie("refresh_token","fakeRefreshToken", "")

	// Here we are setting the fake data that would be returned from the identity-api
	// with the permissions requires to create a new collection
	p.fakeApi.setJsonResponseForPost("/tokens", "faketoken", 200)

	err := chromedp.Run(p.chromeCtx,
		SetCookies(cookieUser, cookieId, cookieRefresh),
		chromedp.Navigate("http://localhost:8080/florence/login"),
		chromedp.WaitVisible(`#app`),
		chromedp.SendKeys("#email", username),
		chromedp.SendKeys("#password", "anything"),
		chromedp.Click(".form button"),
		p.assignUserCookies(),
	)

	if err != nil {
		return err
	}

	return nil
}

func (p *Publisher) signOut() error {
	p.fakeApi.setJsonResponseForDelete("/tokens", "", 200)

	err := chromedp.Run(p.chromeCtx,
		chromedp.Navigate("http://localhost:8080/florence"),
		chromedp.WaitVisible(`#app`),
		chromedp.Click(".global-nav__link:last-of-type"),
		p.assignUserCookies(),
	)

	if err != nil {
		return err
	}

	return nil
}

func (p *Publisher) assignUserCookies() chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		cookies, err := network.GetAllCookies().Do(ctx)
		if err != nil {
			return err
		}
		p.cookies = cookies
		return nil
	})
}

func (p *Publisher) setAuthCookies() {
	p.cookies = append(p.cookies, &network.Cookie{
		Name:         "user_token",
		Value:        "fakeAuthorizationToken",
		Domain:       "localhost",
		Path:         "/",
	})
	p.cookies = append(p.cookies, &network.Cookie{
		Name:         "id_token",
		Value:        "fakeIDToken",
		Domain:       "localhost",
		Path:         "/",
	})
	p.cookies = append(p.cookies, &network.Cookie{
		Name:         "refresh_token",
		Value:        "fakeRefreshToken",
		Domain:       "localhost",
		Path:         "/",
	})
}

func (p *Publisher) isSignedIn() bool {
	for _, cookie := range p.cookies {
		if cookie.Name == "user_token" {
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

