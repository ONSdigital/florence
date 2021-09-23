package steps

import (
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"github.com/cucumber/godog"
	"github.com/pkg/errors"
	"github.com/stretchr/testify/assert"
)

var legacyElementMap = map[string]string {
	"missing email": "",
	"missing password": "#input-error-password",
}

// This steps actually signs in to Florence by entering a dummy username and password using the old auth processes
func (c *Component) legacyISignInAs(role, username string) error {
	if role == "viewer" || role == "admin" {
		return godog.ErrUndefined
	} else if role != "publisher" {
		return errors.New("Unhandled user type supplied")
	}
	c.user = NewLegacyPublisher(c.FakeApi, c.chrome.ctx)
	err := c.user.signIn(username)
	if err != nil {
		return err
	}

	c.SignedInUser = username
	return nil
}

// This step actives the browser UI, entering a collection name
// and presses the "Create Collection" button
// consequently, the form data is sent to Florence back and and outwards to the
// collection creating API
func (c *Component) legacyICreateANewCollectionCalledForManualPublishing(collectionName string) error {
	collectionAction := NewCollectionAction(c.FakeApi, c.chrome.ctx)

	err := collectionAction.create(collectionName)
	if err != nil {
		return err
	}

	return c.StepError()
}

// This step checks that the browser UI shows the correct new
// title of the collection
func (c *Component) legacyIShouldBePresentedWithAEditableCollectionTitled(collectionTitle string) error {

	collectionAction := NewCollectionAction(c.FakeApi, c.chrome.ctx)

	if err := collectionAction.assertHasTitle(collectionTitle); err != nil {
		return err
	}

	return c.StepError()
}


// This step checks that the browser UI shows the type
// of collection schedule created (e.g. "Manual")
func (c *Component) legacyTheCollectionShouldBe(collectionPublishSchedule string) error {
	collectionAction := NewCollectionAction(c.FakeApi, c.chrome.ctx)

	if err := collectionAction.assertHasPublishSchedule(collectionPublishSchedule); err != nil {
		return err
	}

	return c.StepError()
}

// This step asserts that the instructions for creating the collection
// have been sent correctly from Florence backend to the API that creates the collection
func (c *Component) legacyTheseCollectionCreationDetailsShouldHaveBeenSent(collectionDetails *godog.DocString) error {
	for _, outboundRequestBody := range c.FakeApi.outboundRequests {
		assert.JSONEq(c, collectionDetails.Content, outboundRequestBody)
	}

	return c.StepError()
}

func (c *Component) legacyIShouldSeeTheElement(elementKey string) error {
	elementSelector := legacyElementMap[elementKey]
	if elementSelector == "" {
		return godog.ErrUndefined
	}

	var res []*cdp.Node
	err := chromedp.Run(c.chrome.ctx,
		chromedp.Nodes(elementSelector, &res, chromedp.AtLeast(0)),
	)

	if err != nil {
		return err
	}

	assert.NotEqual(c, len(res), 0)
	return c.StepError()
}
