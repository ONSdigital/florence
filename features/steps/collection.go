package steps

import (
	"context"
	"github.com/chromedp/chromedp"
)

type Collection struct {
	api *FakeApi
	chromeCtx context.Context
	//create func (ctx context.Context, actions ...chromedp.Action) error
}

func NewCollectionAction(f *FakeApi, c context.Context) *Collection {
	return &Collection{
		api: f,
		chromeCtx: c,
	}
}

func (c *Collection) create(collectionName string) error {
	c.api.fakeHttp.NewHandler().Post("/collection").AssertBody([]byte(`{"name":"Census jjj"}`)).Reply(200).Body([]byte(`
{
    "approvalStatus": "IN_PROGRESS",
    "publishComplete": false,
    "isEncrypted": false,
    "timeseriesImportFiles": [],
    "id": "abc123",
    "name": "jons collection",
    "type": "manual",
    "teams": []
}

`)).SetHeader("Content-Type", "application/json")

	c.api.setJsonResponseForGet("/collectionDetails/abc123", `
{
    "approvalStatus": "IN_PROGRESS",
    "publishComplete": false,
    "isEncrypted": false,
    "timeseriesImportFiles": [],
    "id": "abc123",
    "name": "my collection",
    "type": "manual",
    "teams": []
}`)

	err := chromedp.Run(c.chromeCtx,
		chromedp.SendKeys("#collection-name", collectionName),
		chromedp.Click(`input[value="manual"]`),
		chromedp.Click("button"),
	)

	return err
}
