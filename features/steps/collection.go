package steps

import (
	"context"
	"fmt"
	"github.com/chromedp/chromedp"
	"github.com/hashicorp/go-uuid"
	"github.com/pkg/errors"
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
	var collectionId, _ = uuid.GenerateUUID()
	c.api.fakeHttp.NewHandler().Post("/collection").AssertBody([]byte(`{"name":"Census 2021","type":"manual","publishDate":null,"teams":[],"collectionOwner":"ADMIN","releaseUri":null}`)).Reply(200).Body([]byte(
		buildCollectionDetailsResponseForId(collectionName, collectionId))).SetHeader("Content-Type", "application/json")

	c.api.setJsonResponseForGet("/collectionDetails/" + collectionId, buildCollectionDetailsResponseForId(collectionName, collectionId))

	err := chromedp.Run(c.chromeCtx,
		chromedp.SendKeys("#collection-name", collectionName),
		chromedp.Click(`input[value="manual"]`),
		chromedp.Click("button"),
	)

	return err
}

func (c *Collection) hasTitle(expectedTitle string) error {
	return  c.hasTextInSelector(expectedTitle, ".drawer h2")
}

func (c *Collection) hasPublishSchedule(expectedPublishSchedule string) error {
	return  c.hasTextInSelector(expectedPublishSchedule, ".drawer h2 + p")
}

func (c *Collection) hasTextInSelector(expectedText string, selector string) error {

	var actualText string
	if err := chromedp.Run(
		c.chromeCtx,
		chromedp.Text(selector, &actualText, chromedp.NodeVisible, chromedp.ByQuery),
	); err != nil {
		return err
	}

	if actualText != expectedText {
		return errors.New(fmt.Sprintf("Expected text in %s to be: %s but it was: %s ", selector, expectedText, actualText))
	}

	return nil
}

func buildCollectionDetailsResponseForId(collectionName string, id string) string {
	return fmt.Sprintf(`
	{
		"inProgress":[],
		"complete":[],
		"reviewed":[],"timeseriesImportFiles":[],
		"approvalStatus":"NOT_STARTED",
		"pendingDeletes":[],
		"datasets":[],
		"datasetVersions":[],
		"teamsDetails":[],
		"id":"%s",
		"name":"%s",
		"type":"manual",
		"teams":[]
	}`,id, collectionName)
}