package steps

import (
	"context"
	"github.com/pkg/errors"
)

type BaseUser struct {
	fakeApi   *FakeApi
	chromeCtx context.Context
}

func NewBaseUser(api *FakeApi, ctx context.Context) *Publisher {
	return &Publisher{fakeApi: api, chromeCtx: ctx}
}

func (u *BaseUser) signIn(username string) error {
	return errors.New("BaseUser does not have sign in implemented")
}

func (u *BaseUser) isSignedIn() bool {
	return false
}

func (u *BaseUser) resetUser(fakeApi *FakeApi, ctx context.Context) {
	u.fakeApi = fakeApi
	u.chromeCtx = ctx
}

func (u *BaseUser) setChromeCtx(ctx context.Context) {
	u.chromeCtx = ctx
}

func (u *BaseUser) setFakeApi(fakeApi *FakeApi) {
	u.fakeApi = fakeApi
}
