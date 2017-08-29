package healthcheck

import (
	"fmt"
	"net/http"
	"time"
)

// Client represents a client for healthchecking
type Client struct {
	url  string
	name string
	cli  *http.Client
}

// New creates a new instance of the client
func New(url, name string) Client {
	return Client{
		url:  url,
		name: name,
		cli:  &http.Client{Timeout: 5 * time.Second},
	}
}

// Healthcheck calls the healthcheck endpoint
func (c Client) Healthcheck() (string, error) {
	resp, err := c.cli.Get(c.url + "/healthcheck")
	if err != nil {
		return c.name, err
	}

	if resp.StatusCode != http.StatusOK {
		return c.name, fmt.Errorf("invalid response from %s: %d", c.name, resp.StatusCode)
	}

	return "", nil
}
