package log

const (
	// FATAL ...
	FATAL severity = iota
	// ERROR ...
	ERROR
	// WARN ...
	WARN
	// INFO ...
	INFO
)

// severity is the log severity level
//
// we don't export this because we don't want the caller
// to define their own severity levels
type severity int

func (s severity) attach(le *EventData) {
	le.Severity = &s
}
