package steps

import "context"

type User interface {
	signIn(username string) error
	isSignedIn() bool
	signOut()
	resetUser(fakeApi *FakeApi, ctx context.Context)
	setChromeCtx(ctx context.Context)
	setFakeApi(fakeApi *FakeApi)
}
