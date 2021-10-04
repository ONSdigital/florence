package steps

import (
	"context"
	"fmt"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
	"net/http"
)

type LegacyPublisher struct {
	fakeApi   *FakeApi
	chromeCtx context.Context
	cookies   []*network.Cookie
}

func NewLegacyPublisher(api *FakeApi, ctx context.Context) *LegacyPublisher {
	return &LegacyPublisher{fakeApi: api, chromeCtx: ctx}
}

func (p *LegacyPublisher) signIn(username string) error {
	var cookies []*http.Cookie

	if username == "not.a.user@ons.gov.uk" {
		p.fakeApi.fakeHttp.NewHandler().Post("/login").Reply(401).Body([]byte(``))
	} else if username == "" {
		p.fakeApi.fakeHttp.NewHandler().Post("/login").Reply(400).Body([]byte(``))
	} else if username == "no.password@ons.gov.uk" {
		p.fakeApi.fakeHttp.NewHandler().Post("/login").Reply(401).Body([]byte("Authentication failed."))
	} else {
		cookies = append(cookies, GenerateCookie("X-Florence-Token", "fakeFlorenceToken", "", "/", true))
		// Here we are setting the fake data that would be returned from the identity-api
		// with the permissions requires to create a new collection
		p.fakeApi.fakeHttp.NewHandler().Post("/login").Reply(200).Body([]byte(`faketoken`))
		p.fakeApi.setJsonResponseForGet("/permission", fmt.Sprintf(`{"email":"%s","admin":true,"editor":true}`, username))
	}

	err := chromedp.Run(p.chromeCtx,
		SetCookies(cookies),
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

func (p *LegacyPublisher) assignUserCookies() chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		cookies, err := network.GetAllCookies().Do(ctx)
		if err != nil {
			return err
		}
		p.cookies = cookies
		return nil
	})
}

func (p *LegacyPublisher) isSignedIn() bool {
	for _, cookie := range p.cookies {
		if cookie.Name == "X-Florence-Token" {
			return true
		}
	}
	return false
}

func (p *LegacyPublisher) signOut() error {
	p.cookies = nil
	return nil
}

func (p *LegacyPublisher) setAuthCookies() {
	p.cookies = append(p.cookies, &network.Cookie{
		Name:         "X-Florence-Token",
		Value:        "fakeFlorenceToken",
		Domain:       "localhost",
		Path:         "/",
	})
}

func (p *LegacyPublisher) resetUser(fakeApi *FakeApi, ctx context.Context) {
	p.fakeApi = fakeApi
	p.chromeCtx = ctx
}

func (p *LegacyPublisher) setChromeCtx(ctx context.Context) {
	p.chromeCtx = ctx
}

func (p *LegacyPublisher) setFakeApi(fakeApi *FakeApi) {
	p.fakeApi = fakeApi
}
