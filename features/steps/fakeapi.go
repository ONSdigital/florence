package steps

import (
	"github.com/maxcnunes/httpfake"
	"testing"
)

type FakeApi struct {
	fakeHttp *httpfake.HTTPFake
}

func NewFakeApi(t testing.TB) *FakeApi {
	return &FakeApi{
		fakeHttp: httpfake.New(httpfake.WithTesting(t)),
	}
}

func (f *FakeApi) setJsonResponseForGet(url string, responseBody string) {
	f.fakeHttp.NewHandler().Get(url).Reply(200).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))
}

func (f *FakeApi) setJsonResponseForPost(url string, responseBody string) {
	f.fakeHttp.NewHandler().Post(url).Reply(200).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))
}

func (f *FakeApi) Close() {
	f.fakeHttp.Close()
}
func (f *FakeApi) Reset() {
	f.fakeHttp.Reset()
}
