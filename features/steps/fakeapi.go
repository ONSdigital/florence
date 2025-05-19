package steps

import (
	"fmt"
	"github.com/maxcnunes/httpfake"
	"io/ioutil"
	"net/http"
	"testing"
)

type FakeAPI struct {
	fakeHTTP                     *httpfake.HTTPFake
	outboundRequests             []string
	collectOutboundRequestBodies httpfake.CustomAssertor
}

func NewFakeAPI(t testing.TB) *FakeAPI {
	fa := &FakeAPI{
		fakeHTTP: httpfake.New(httpfake.WithTesting(t)),
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

func (f *FakeAPI) setJSONResponseForGet(url, responseBody string) {
	f.fakeHTTP.NewHandler().Get(url).AssertHeaders("Content-Type").Reply(200).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))
}

func (f *FakeAPI) setJSONResponseForPost(url, responseBody string, status int, additionalHeaders ...*Header) *httpfake.Request {
	request := f.fakeHTTP.NewHandler().Post(url).AssertHeaders("Content-Type")

	request.Reply(status).SetHeader("Content-Type", "application/json").Body([]byte(responseBody))
	if additionalHeaders != nil {
		for _, header := range additionalHeaders {
			request.Response.SetHeader(header.Name, header.Value)
		}
	}

	return request
}

func (f *FakeAPI) Close() {
	f.fakeHTTP.Close()
}
func (f *FakeAPI) Reset() {
	f.fakeHTTP.Reset()
}

type Header struct {
	Name  string
	Value string
}
