package steps

import (
	"context"
	"fmt"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
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

	// Here we are setting the fake data that would be returned from the identity-api
	// with the permissions requires to create a new collection
	p.fakeApi.fakeHttp.NewHandler().Post("/login").Reply(200).Body([]byte(`faketoken`))
	p.fakeApi.setJsonResponseForGet("/permission", fmt.Sprintf(`{"email":"%s","admin":true,"editor":true}`, username))

	err := chromedp.Run(p.chromeCtx,
		chromedp.Navigate("http://localhost:8080/florence/login"),
		chromedp.WaitVisible(`#app`),
		chromedp.SendKeys("#email", username),
		chromedp.SendKeys("#password", "anything"),
		chromedp.Click(".form button"),
	)

	if err != nil {
		return err
	}

	return nil
}

func (p *LegacyPublisher) isSignedIn() bool {
	fmt.Println(p.chromeCtx)
	return true
}

func (p *LegacyPublisher) signOut() {
	p.cookies = nil
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
