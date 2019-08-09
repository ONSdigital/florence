BIND_ADDR ?= :8081
BINPATH ?= build

VERSION=`git describe --tags`
LDFLAGS=-ldflags "-w -s -X main.Version=${VERSION}"

VAULT_ADDR?='http://127.0.0.1:8200'

# The following variables are used to generate a vault token for the app. The reason for declaring variables, is that
# its difficult to move the token code in a Makefile action. Doing so makes the Makefile more difficult to
# read and starts introduction if/else statements.
VAULT_POLICY:="$(shell vault policy write -address=$(VAULT_ADDR) read-psk policy.hcl)"
TOKEN_INFO:="$(shell vault token create -address=$(VAULT_ADDR) -policy=read-psk -period=24h -display-name=florence)"
APP_TOKEN:="$(shell echo $(TOKEN_INFO) | awk '{print $$6}')"

build: generate
	go build $(LDFLAGS) -tags 'production' -o $(BINPATH)/florence

debug: generate
	go build $(LDFLAGS) -tags 'debug' -o $(BINPATH)/florence
	VAULT_TOKEN=$(APP_TOKEN) VAULT_ADDR=$(VAULT_ADDR) HUMAN_LOG=1 BIND_ADDR=${BIND_ADDR} $(BINPATH)/florence

generate: ${GOPATH}/bin/go-bindata
	# build the production version
	cd assets; ${GOPATH}/bin/go-bindata -o prod.go -pkg assets ../dist/...
	{ echo "// +build production"; cat assets/prod.go; } > assets/prod.go.new
	mv assets/prod.go.new assets/prod.go
	# build the debug version
	cd assets; ${GOPATH}/bin/go-bindata -debug -o debug.go -pkg assets ../dist/...
	{ echo "// +build debug"; cat assets/debug.go; } > assets/debug.go.new
	mv assets/debug.go.new assets/debug.go

test: test-go test-npm test-pretty

test-go:
	go test -cover $(shell go list ./... | grep -v /vendor/) -tags 'production'

test-npm:
	cd src; npm install && npm run test

test-pretty:
        prettier --check "src/app/**/*.js"

node-modules:
	cd src; npm install
	cd src/legacy; npm install

watch-src:
	make node-modules
	cd src; npm run watch

vault:
	@echo "$(VAULT_POLICY)"
	@echo "$(TOKEN_INFO)"
	@echo "$(APP_TOKEN)"

${GOPATH}/bin/go-bindata:
	go get -u github.com/jteeuwen/go-bindata/go-bindata

.PHONY: build debug test node-modules watch-src
