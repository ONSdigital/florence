package steps

import (
	"github.com/ONSdigital/florence/config"
	"github.com/cucumber/godog"
	"github.com/pkg/errors"
	"github.com/stretchr/testify/assert"
)

func (c *Component) RegisterSteps(ctx *godog.ScenarioContext) {
	cfg, _ := config.Get()
	if cfg.SharedConfig.EnableNewSignIn == false {
		ctx.Step(`^I sign in as "([^"]*)" user "([^"]*)"$`, c.legacyISignInAs)
		ctx.Step(`^I create a new collection called "([^"]*)" for manual publishing$`, c.legacyICreateANewCollectionCalledForManualPublishing)
		ctx.Step(`^I should be presented with a editable collection titled "([^"]*)"$`, c.legacyIShouldBePresentedWithAEditableCollectionTitled)
		ctx.Step(`^the collection publishing schedule should be "([^"]*)"$`, c.legacyTheCollectionShouldBe)
		ctx.Step(`^a collection with these details should be created:$`, c.legacyTheseCollectionCreationDetailsShouldHaveBeenSent)
		ctx.Step(`^I have auth tokens$`, c.legacyIHaveAuthTokens)
		ctx.Step(`^I am not signed in$`, c.legacyIAmNotSignedIn)
		ctx.Step(`^I am signed in$`, c.legacyIAmSignedIn)
		ctx.Step(`^I sign out$`, c.legacyISignOut)
	} else {
		ctx.Step(`^I sign in as "([^"]*)" user "([^"]*)"$`, c.iSignInAs)
		ctx.Step(`^I create a new collection called "([^"]*)" for manual publishing$`, c.iCreateANewCollectionCalledForManualPublishing)
		ctx.Step(`^I should be presented with a editable collection titled "([^"]*)"$`, c.iShouldBePresentedWithAEditableCollectionTitled)
		ctx.Step(`^the collection publishing schedule should be "([^"]*)"$`, c.theCollectionShouldBe)
		ctx.Step(`^a collection with these details should be created:$`, c.theseCollectionCreationDetailsShouldHaveBeenSent)
		ctx.Step(`^I have auth tokens$`, c.iHaveAuthTokens)
		ctx.Step(`^I am not signed in$`, c.iAmNotSignedIn)
		ctx.Step(`^I am signed in$`, c.iAmSignedIn)
		ctx.Step(`^I sign out$`, c.iSignOut)
	}

}

// This steps actually signs in to Florence by entering a dummy username and password using the new auth processes
func (c *Component) iSignInAs(role, username string) error {
	if role != "publisher" {
		return errors.New("Unhandled user type supplied")
	}
	c.user = NewPublisher(c.FakeApi, c.chrome.ctx)
	err := c.user.signIn(username)
	if err != nil {
		return err
	}

	c.SignedInUser = username
	return nil
}

func (c *Component) iHaveAuthTokens() error {
	c.user.setAuthCookies()
	return nil
}

func (c *Component) iAmNotSignedIn() error {
	assert.False(c, c.user.isSignedIn())
	return c.StepError()
}

func (c *Component) iAmSignedIn() error {
	assert.True(c, c.user.isSignedIn())
	return c.StepError()
}

func (c *Component) iSignOut() error {
	return c.user.signOut()
}
