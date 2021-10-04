package steps

import (
	"github.com/ONSdigital/florence/config"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"github.com/cucumber/godog"
	"github.com/pkg/errors"
	"github.com/stretchr/testify/assert"
)

var elementMap = map[string]string {
	"missing email": ".notifications__item--warning",
	"missing password": ".notifications__item--warning",
}

func (c *Component) RegisterSteps(ctx *godog.ScenarioContext) {
	cfg, _ := config.Get()
	if cfg.SharedConfig.EnableNewSignIn == false {
		ctx.Step(`^I sign in as "([^"]*)" user "([^"]*)"$`, c.legacyISignInAs)
		ctx.Step(`^I create a new collection called "([^"]*)" for manual publishing$`, c.legacyICreateANewCollectionCalledForManualPublishing)
		ctx.Step(`^I should be presented with a editable collection titled "([^"]*)"$`, c.legacyIShouldBePresentedWithAEditableCollectionTitled)
		ctx.Step(`^the collection publishing schedule should be "([^"]*)"$`, c.legacyTheCollectionShouldBe)
		ctx.Step(`^a collection with these details should be created:$`, c.legacyTheseCollectionCreationDetailsShouldHaveBeenSent)
		ctx.Step(`^I should see the "([^"]*)" element$`, c.legacyIShouldSeeTheElement)
	} else {
		ctx.Step(`^I sign in as "([^"]*)" user "([^"]*)"$`, c.iSignInAs)
		ctx.Step(`^I create a new collection called "([^"]*)" for manual publishing$`, c.iCreateANewCollectionCalledForManualPublishing)
		ctx.Step(`^I should be presented with a editable collection titled "([^"]*)"$`, c.iShouldBePresentedWithAEditableCollectionTitled)
		ctx.Step(`^the collection publishing schedule should be "([^"]*)"$`, c.theCollectionShouldBe)
		ctx.Step(`^a collection with these details should be created:$`, c.theseCollectionCreationDetailsShouldHaveBeenSent)
		ctx.Step(`^I should see the "([^"]*)" element$`, c.iShouldSeeTheElement)
	}
	ctx.Step(`^I have auth tokens$`, c.iHaveAuthTokens)
	ctx.Step(`^I am not signed in$`, c.iAmNotSignedIn)
	ctx.Step(`^I am signed in$`, c.iAmSignedIn)
	ctx.Step(`^I sign out$`, c.iSignOut)

}

// This steps actually signs in to Florence by entering a dummy username and password using the new auth processes
func (c *Component) iSignInAs(role, username string) error {
	if role == "admin" {
		return godog.ErrPending
	} else if role == "publisher" {
		c.user = NewPublisher(c.FakeApi, c.chrome.ctx)
	} else if role == "viewer" {
		return godog.ErrPending
	} else {
		return errors.New("Unhandled user type supplied")
	}
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

func (c *Component) iShouldSeeTheElement(elementKey string) error {
	elementSelector := elementMap[elementKey]
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
