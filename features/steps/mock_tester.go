package steps

import (
	"fmt"
	"testing"
)

type mockTester struct {
	testing.TB
	err error
}

func (t *mockTester) Log(args ...interface{}) {
}

func (t *mockTester) Logf(format string, args ...interface{}) {
	t.err = fmt.Errorf(format, args...)
}

func (t *mockTester) Errorf(format string, args ...interface{}) {
	t.err = fmt.Errorf(format, args...)
}

func (t *mockTester) StepError() error {
	return t.err
}

