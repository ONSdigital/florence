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

	// Here we are setting the fake data that would be returned from the identity-api
	// with the permissions requires to create a new collection
	p.fakeApi.setJsonResponseForPost("/tokens", "faketoken", 200, &Header{Name: "ID", Value: "fakeIdToken"})

	err := chromedp.Run(p.chromeCtx,
		chromedp.Navigate("http://localhost:8080/florence/login"),
		chromedp.WaitVisible(`#app`),
		chromedp.SendKeys("#email", username),
		chromedp.SendKeys("#password", "anything"),
		chromedp.Click(".form button"),
		ShowCookies(p),
	)

	if err != nil {
		return err
	}

	return nil
}

func ShowCookies(p *Publisher) chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		cookies, err := network.GetAllCookies().Do(ctx)
		if err != nil {
			return err
		}
		p.cookies = cookies
		return nil
	})
}

func (p *Publisher) isSignedIn() bool {
	for _, cookie := range p.cookies {
		if cookie.Name == "Authorization" {
			return true
		}
	}
	return false
}

func (p *Publisher) signOut() {
	p.cookies = nil
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

