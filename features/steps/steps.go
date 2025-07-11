package steps

import (
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"github.com/cucumber/godog"
	"github.com/pkg/errors"
	"github.com/stretchr/testify/assert"
)

var elementMap = map[string]string{
	"missing email":    ".notifications__item--warning",
	"missing password": ".notifications__item--warning",
}

func (c *Component) RegisterSteps(ctx *godog.ScenarioContext) {
	ctx.Step(`^I sign in as "([^"]*)" user "([^"]*)"$`, c.iSignInAs)
	ctx.Step(`^I create a new collection called "([^"]*)" for manual publishing$`, c.iCreateANewCollectionCalledForManualPublishing)
	ctx.Step(`^I should be presented with an editable collection titled "([^"]*)"$`, c.iShouldBePresentedWithAEditableCollectionTitled)
	ctx.Step(`^the collection publishing schedule should be "([^"]*)"$`, c.theCollectionShouldBe)
	ctx.Step(`^a collection with these details should be created:$`, c.theseCollectionCreationDetailsShouldHaveBeenSent)
	ctx.Step(`^I should see the "([^"]*)" element$`, c.iShouldSeeTheElement)
	ctx.Step(`^I have auth tokens$`, c.iHaveAuthTokens)
	ctx.Step(`^I am not signed in$`, c.iAmNotSignedIn)
	ctx.Step(`^I am signed in$`, c.iAmSignedIn)
	ctx.Step(`^I sign out$`, c.iSignOut)
}

// This steps actually signs in to Florence by entering a dummy username and password using the new auth processes
func (c *Component) iSignInAs(role, username string) error {
	switch role {
	case "admin":
		return godog.ErrPending
	case "publisher":
		c.user = NewPublisher(c.FakeAPI, c.chrome.ctx)
	case "viewer":
		return godog.ErrPending
	default:
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
	c.user.signOut()
	return c.StepError()
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
