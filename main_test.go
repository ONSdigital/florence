package main

import (
	"flag"
	"fmt"
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
}

func (f *ComponentTest) InitializeScenario(ctx *godog.ScenarioContext) {
	authorizationFeature := componenttest.NewAuthorizationFeature()
	datasetFeature, err := steps.NewDatasetFeature()
	if err != nil {
		panic(err)
	}

	apiFeature := componenttest.NewAPIFeature(datasetFeature.InitialiseService)

	ctx.BeforeScenario(func(*godog.Scenario) {
		apiFeature.Reset()
		datasetFeature.Reset()
		authorizationFeature.Reset()
	})

	ctx.AfterScenario(func(*godog.Scenario, error) {
		datasetFeature.Close()
		authorizationFeature.Close()
	})

	datasetFeature.RegisterSteps(ctx)
	apiFeature.RegisterSteps(ctx)
	authorizationFeature.RegisterSteps(ctx)
}

func (f *ComponentTest) InitializeTestSuite(ctx *godog.TestSuiteContext) {
	ctx.BeforeSuite(func() {
	})
	ctx.AfterSuite(func() {
	})
}

func TestComponent(t *testing.T) {
	if *componentFlag {
		status := 0

		var opts = godog.Options{
			Output: colors.Colored(os.Stdout),
			Format: "pretty",
			Paths:  flag.Args(),
		}

		f := &ComponentTest{}

		status = godog.TestSuite{
			Name:                 "feature_tests",
			ScenarioInitializer:  f.InitializeScenario,
			TestSuiteInitializer: f.InitializeTestSuite,
			Options:              &opts,
		}.Run()

		fmt.Println("=================================")
		fmt.Printf("Component test coverage: %.2f%%\n", testing.Coverage()*100)
		fmt.Println("=================================")

		os.Exit(status)
	} else {
		t.Skip("component flag required to run component tests")
	}
}
