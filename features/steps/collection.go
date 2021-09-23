package steps

import (
	"context"
	"fmt"
	componenttest "github.com/ONSdigital/dp-component-test"
	"github.com/chromedp/chromedp"
	"github.com/hashicorp/go-uuid"
	"github.com/stretchr/testify/assert"
)

type Collection struct {
	componenttest.ErrorFeature
	api       *FakeApi
	chromeCtx context.Context
}

func NewCollectionAction(f *FakeApi, c context.Context) *Collection {
	return &Collection{
		api:       f,
		chromeCtx: c,
	}
}

func (c *Collection) create(collectionName string) error {

	var collectionId, _ = uuid.GenerateUUID()

	// Here we set up the fake responses that would be returned from the collection-creating API
	// including the fake collection details that will appear in the browser UI as a result
	collectionDetailsResponse := buildCollectionDetailsResponseForId(collectionName, collectionId)

	c.api.setJsonResponseForPost("/collection", collectionDetailsResponse, 200).AssertCustom(c.api.collectOutboundRequestBodies)
	c.api.setJsonResponseForGet("/collectionDetails/"+collectionId, collectionDetailsResponse)

	// Enter the name of the collection and press the button to send the form
	err := chromedp.Run(c.chromeCtx,
		chromedp.SendKeys("#collection-name", collectionName),
		chromedp.Click(`input[value="manual"]`),
		chromedp.Click("button"),
	)

	if err != nil {
		return err
	}

	return nil
}

func (c *Collection) assertHasTitle(expectedTitle string) error {
	return c.assertHasTextInSelector(expectedTitle, ".drawer h2")
}

func (c *Collection) assertHasPublishSchedule(expectedPublishSchedule string) error {
	return c.assertHasTextInSelector(expectedPublishSchedule, ".drawer h2 + p")
}

func (c *Collection) assertHasTextInSelector(expectedText string, selector string) error {

	var actualText string
	if err := chromedp.Run(
		c.chromeCtx,
		chromedp.Text(selector, &actualText, chromedp.NodeVisible, chromedp.ByQuery),
	); err != nil {
		return err
	}

	assert.Equal(c, expectedText, actualText, fmt.Sprintf("expected to see text: '%s' in selector: %s", expectedText, selector))

	return c.StepError()
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
	}`, id, collectionName)
}
