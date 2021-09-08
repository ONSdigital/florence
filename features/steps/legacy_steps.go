package steps

import (
	"github.com/cucumber/godog"
	"github.com/stretchr/testify/assert"
)

// This steps actually signs in to Florence by entering a dummy username and password using the old auth processes
func (c *Component) legacyISignInAs(role, username string) error {

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

func (c *Component) legacyIAmNotSignedIn() error {
	assert.False(c.ApiFeature, c.user.isSignedIn())
	return nil
}

func (c *Component) legacyIAmSignedIn() error {
	return godog.ErrUndefined
}

func (c *Component) legacyISignOut() error {
	return godog.ErrPending
}
