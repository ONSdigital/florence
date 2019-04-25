package log

import (
	"net/http"
	"strconv"
	"time"
)

type eventHTTP struct {
	StatusCode *int   `json:"status_code,omitempty"`
	Method     string `json:"method,omitempty"`

	// URL data
	Scheme string `json:"scheme,omitempty"`
	Host   string `json:"host,omitempty"`
	Port   int    `json:"port,omitempty"`
	Path   string `json:"path,omitempty"`
	Query  string `json:"query,omitempty"`

	// Timing data
	StartedAt             *time.Time     `json:"started_at,omitempty"`
	EndedAt               *time.Time     `json:"ended_at,omitempty"`
	Duration              *time.Duration `json:"duration,omitempty"`
	ResponseContentLength int64          `json:"response_content_length,omitempty"`
}

func (l *eventHTTP) attach(le *EventData) {
	le.HTTP = l
}

// HTTP ...
func HTTP(req *http.Request, statusCode int, responseContentLength int64, startedAt, endedAt *time.Time) option {
	port := 0
	if p := req.URL.Port(); len(p) > 0 {
		port, _ = strconv.Atoi(p)
	}

	var duration time.Duration
	if startedAt != nil && endedAt != nil {
		duration = endedAt.Sub(*startedAt)
	}

	return &eventHTTP{
		StatusCode: &statusCode,
		Method:     req.Method,

		Scheme: req.URL.Scheme,
		Host:   req.URL.Hostname(),
		Port:   port,
		Path:   req.URL.Path,
		Query:  req.URL.RawQuery,

		StartedAt:             startedAt,
		EndedAt:               endedAt,
		Duration:              &duration,
		ResponseContentLength: responseContentLength,
	}
}
