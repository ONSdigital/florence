package steps

import (
	"context"
	"fmt"
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
	c.api.fakeHttp.NewHandler().Post("/collection").AssertBody([]byte(`{"name":"Census 2021","type":"manual","publishDate":null,"teams":[],"collectionOwner":"ADMIN","releaseUri":null}`)).Reply(200).Body([]byte(
		buildCollectionDetailsResponse(collectionName))).SetHeader("Content-Type", "application/json")

	c.api.setJsonResponseForGet("/collectionDetails/abc123", buildCollectionDetailsResponse(collectionName))

	err := chromedp.Run(c.chromeCtx,
		chromedp.SendKeys("#collection-name", collectionName),
		chromedp.Click(`input[value="manual"]`),
		chromedp.Click("button"),
	)

	return err
}

func buildCollectionDetailsResponse(collectionName string) string {
	return fmt.Sprintf(`
	{
		"approvalStatus": "IN_PROGRESS",
		"publishComplete": false,
		"isEncrypted": false,
		"timeseriesImportFiles": [],
		"id": "abc123",
		"name": "%s",
		"type": "manual",
		"teams": []
	}`, collectionName)
}
