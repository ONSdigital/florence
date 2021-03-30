package steps

import (
	"context"
	"fmt"
	"github.com/chromedp/chromedp"
	"github.com/hashicorp/go-uuid"
	"github.com/stretchr/testify/assert"
)

type Collection struct {
	api *FakeApi
	chromeCtx context.Context
	errorFeature *mockTester
}

func NewCollectionAction(ef *mockTester, f *FakeApi, c context.Context) *Collection {
	return &Collection{
		errorFeature: ef,
		api: f,
		chromeCtx: c,
	}
}

func (c *Collection) create(collectionName string) error {
	var collectionId, _ = uuid.GenerateUUID()
	c.api.fakeHttp.NewHandler().Post("/collection").AssertBody([]byte(`{"name":"`+collectionName+`","type":"manual","publishDate":0,"teams":[],"collectionOwner":"ADMIN","releaseUri":null}`)).Reply(200).Body([]byte(
		buildCollectionDetailsResponseForId(collectionName, collectionId))).SetHeader("Content-Type", "application/json")

	c.api.setJsonResponseForGet("/collectionDetails/" + collectionId, buildCollectionDetailsResponseForId(collectionName, collectionId))

	err := chromedp.Run(c.chromeCtx,
		chromedp.SendKeys("#collection-name", collectionName),
		chromedp.Click(`input[value="manual"]`),
		chromedp.Click("button"),
	)

	if err != nil {
		return err
	}

	return c.errorFeature.StepError()
}

func (c *Collection) assertHasTitle(expectedTitle string) error {
	return c.assertHasTextInSelector(expectedTitle, ".drawer h2")
}

func (c *Collection) assertHasPublishSchedule(expectedPublishSchedule string) error {
	return  c.assertHasTextInSelector(expectedPublishSchedule, ".drawer h2 + p")
}

func (c *Collection) assertHasTextInSelector(expectedText string, selector string) error {

	var actualText string
	if err := chromedp.Run(
		c.chromeCtx,
		chromedp.Text(selector, &actualText, chromedp.NodeVisible, chromedp.ByQuery),
	); err != nil {
		return err
	}

	assert.Equal(c.errorFeature, expectedText, actualText, fmt.Sprintf("expected to see text: '%s' in selector: %s", expectedText, selector))

	return c.errorFeature.StepError()
}

func buildCollectionDetailsResponseForId(collectionName string, id string) string {
	return fmt.Sprintf(`
	{
		"inProgress":[],
		"complete":[],
		"reviewed":[],
		"timeseriesImportFiles":[],
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