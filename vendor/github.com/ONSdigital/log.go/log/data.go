package log

// Data ...
type Data map[string]interface{}

func (d Data) attach(le *EventData) {
	le.Data = &d
}
