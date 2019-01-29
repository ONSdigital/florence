package log

import (
	"log"
	"strings"
)

func init() {
	// Set the output for the default go logger
	log.SetOutput(&captureLogger{})
	log.SetFlags(log.Flags() &^ (log.Ldate | log.Ltime))
}

type captureLogger struct{}

func (c captureLogger) Write(b []byte) (n int, err error) {
	Event(nil, "third party logs", Data{"raw": strings.TrimSpace(string(b))})
	return len(b), nil
}
