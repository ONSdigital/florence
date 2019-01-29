package log

import (
	"reflect"
	"runtime"
)

type eventError struct {
	Error      string            `json:"error,omitempty"`
	StackTrace []eventStackTrace `json:"stack_trace,omitempty"`
	// This uses interface{} type, but should always be a type of kind struct
	// (which serialises to map[string]interface{})
	// See `func Error` switch block for more info
	Data interface{} `json:"data,omitempty"`
}

type eventStackTrace struct {
	File     string `json:"file,omitempty"`
	Line     int    `json:"line,omitempty"`
	Function string `json:"function,omitempty"`
}

func (l *eventError) attach(le *EventData) {
	le.Error = l
}

// Error ...
func Error(err error) option {
	e := &eventError{
		Error:      err.Error(),
		StackTrace: make([]eventStackTrace, 0),
	}

	k := reflect.Indirect(reflect.ValueOf(err)).Type().Kind()
	switch k {
	case reflect.Struct:
		// We've got a struct type, so make it the top level value
		e.Data = err
	default:
		// We have something else, so nest it inside a Data value
		e.Data = Data{"value": err}
	}

	pc := make([]uintptr, 10)
	n := runtime.Callers(2, pc)
	if n > 0 {
		frames := runtime.CallersFrames(pc[:n])

		for {
			frame, more := frames.Next()

			e.StackTrace = append(e.StackTrace, eventStackTrace{
				File:     frame.File,
				Line:     frame.Line,
				Function: frame.Function,
			})

			if !more {
				break
			}
		}
	}

	return e
}
