package main

import (
	"flag"
	"os"
	"testing"

	componenttest "github.com/ONSdigital/dp-component-test"
	steps "github.com/ONSdigital/florence/features/steps"
	"github.com/cucumber/godog"
	"github.com/cucumber/godog/colors"
)

var componentFlag = flag.Bool("component", false, "perform component tests")

type ComponentTest struct {
	MongoFeature *componenttest.MongoFeature
	testingT *testing.T
}

func (c *ComponentTest) InitializeScenario(ctx *godog.ScenarioContext) {
	authorizationFeature := componenttest.NewAuthorizationFeature()
	florenceFeature, err := steps.NewFlorenceComponent()
	if err != nil {
		panic(err)
	}

	apiFeature := componenttest.NewAPIFeature(florenceFeature.InitialiseService)

	ctx.BeforeScenario(func(*godog.Scenario) {
		apiFeature.Reset()
		florenceFeature.Reset()
		authorizationFeature.Reset()
	})

	ctx.AfterScenario(func(*godog.Scenario, error) {
		florenceFeature.Close()
		authorizationFeature.Close()
	})

	florenceFeature.RegisterSteps(ctx)
	apiFeature.RegisterSteps(ctx)
	authorizationFeature.RegisterSteps(ctx)
}

func (c *ComponentTest) InitializeTestSuite(ctx *godog.TestSuiteContext) {
	ctx.BeforeSuite(func() {
	})
	ctx.AfterSuite(func() {
	})
}

func TestComponent(t *testing.T) {
	if *componentFlag {
		var opts = godog.Options{
			Output: colors.Colored(os.Stdout),
			Format: "pretty",
			Paths:  flag.Args(),
		}

		f := &ComponentTest{testingT: t}

		godog.TestSuite{
			Name:                 "feature_tests",
			ScenarioInitializer:  f.InitializeScenario,
			TestSuiteInitializer: f.InitializeTestSuite,
			Options:              &opts,
		}.Run()

	} else {
		t.Skip("component flag required to run component tests")
	}
}
