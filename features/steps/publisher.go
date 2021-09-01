package steps

import (
	"context"
	"fmt"
	"github.com/chromedp/chromedp"
)

type Publisher struct {
	fakeApi   *FakeApi
	chromeCtx context.Context
}

func NewPublisher(api *FakeApi, ctx context.Context) *Publisher {
	return &Publisher{fakeApi: api, chromeCtx: ctx}
}

func (p *Publisher) signIn(username string) error {

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
