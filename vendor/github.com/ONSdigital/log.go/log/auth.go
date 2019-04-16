package log

type eventAuth struct {
	Identity     string       `json:"identity,omitempty"`
	IdentityType identityType `json:"identity_type,omitempty"`
}

type identityType string

const (
	// SERVICE represents a service account
	SERVICE identityType = "service"
	// USER represents a user account
	USER = "user"
)

func (l *eventAuth) attach(le *EventData) {
	le.Auth = l
}

// Auth ...
func Auth(identityType identityType, identity string) option {
	return &eventAuth{
		Identity:     identity,
		IdentityType: identityType,
	}
}
