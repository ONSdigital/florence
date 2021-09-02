package steps

import "context"

type User interface {
	signIn(username string) error
	setChromeCtx(ctx context.Context)
	setFakeApi(fakeApi *FakeApi)
}
