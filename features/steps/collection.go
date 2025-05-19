package steps

import (
	"context"

	componenttest "github.com/ONSdigital/dp-component-test"
)

type Collection struct {
	componenttest.ErrorFeature
	api       *FakeAPI
	chromeCtx context.Context
}

func NewCollectionAction(f *FakeAPI, c context.Context) *Collection {
	return &Collection{
		api:       f,
		chromeCtx: c,
	}
}
