package steps

import (
	"fmt"
	"github.com/maxcnunes/httpfake"
	"io/ioutil"
	"net/http"
	"testing"
)

type FakeApi struct {
	fakeHttp                     *httpfake.HTTPFake
	outboundRequests             []string
	collectOutboundRequestBodies httpfake.CustomAssertor
}

func NewFakeApi(t testing.TB) *FakeApi {
	fa := &FakeApi{
		fakeHttp: httpfake.New(httpfake.WithTesting(t)),
	}

	fa.collectOutboundRequestBodies = func(r *http.Request) error {
		// inspect request
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			return fmt.Errorf("error reading the outbound request body: %s", err.Error())
		}
		fa.outboundRequests = append(fa.outboundRequests, string(body))
		return nil
	}

	return fa
}

func (f *FakeApi) setJsonResponseForGet(url string, responseBody string) {
	f.fakeHttp.NewHandler().Get(url).AssertHeaders("Content-Type").Reply(200).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))
}

func (f *FakeApi) setJsonResponseForPost(url string, responseBody string, status int, additionalHeaders ...*Header) *httpfake.Request {
	request := f.fakeHttp.NewHandler().Post(url).AssertHeaders("Content-Type")

	request.Reply(status).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))

	for _, header := range additionalHeaders {
		request.Response.SetHeader(header.Name, header.Value)
	}

	return request
}

func (f *FakeApi) Close() {
	f.fakeHttp.Close()
}
func (f *FakeApi) Reset() {
	f.fakeHttp.Reset()
}

type Header struct {
	Name string
	Value  string
}
