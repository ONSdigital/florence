package steps

import (
	"fmt"
	"testing"
)

type ErrorFeature struct {
	testing.TB
	err error
}

func (t *ErrorFeature) Log(args ...interface{}) {
}

func (t *ErrorFeature) Logf(format string, args ...interface{}) {
	t.err = fmt.Errorf(format, args...)
}

func (t *ErrorFeature) Errorf(format string, args ...interface{}) {
	t.err = fmt.Errorf(format, args...)
}

func (t *ErrorFeature) StepError() error {
	return t.err
}

