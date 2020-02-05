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

.PHONY: build
build: node-modules generate-go-prod
	go build $(LDFLAGS) -tags 'production' -o $(BINPATH)/florence

.PHONY: dev
dev: node-modules generate-go-debug
	go build $(LDFLAGS) -tags 'debug' -o $(BINPATH)/florence
	VAULT_TOKEN=$(APP_TOKEN) VAULT_ADDR=$(VAULT_ADDR) HUMAN_LOG=1 BIND_ADDR=${BIND_ADDR} $(BINPATH)/florence

.PHONY: debug
debug: generate-go-debug
	go build $(LDFLAGS) -tags 'debug' -o $(BINPATH)/florence
	VAULT_TOKEN=$(APP_TOKEN) VAULT_ADDR=$(VAULT_ADDR) HUMAN_LOG=1 BIND_ADDR=${BIND_ADDR} $(BINPATH)/florence

.PHONY: generate-go-prod
generate-go-prod:
	# Generate the production assets version
	cd assets; go run github.com/jteeuwen/go-bindata/go-bindata -o prod.go -pkg assets ../dist/...
	{ echo "// +build production"; cat assets/prod.go; } > assets/prod.go.new
	mv assets/prod.go.new assets/prod.go

.PHONY: generate-go-debug
generate-go-debug:
	# Gnerate the debug assets version
	cd assets; go run github.com/jteeuwen/go-bindata/go-bindata -debug -o debug.go -pkg assets ../dist/...
	{ echo "// +build debug"; cat assets/debug.go; } > assets/debug.go.new
	mv assets/debug.go.new assets/debug.go	

.PHONY: test
test: test-npm test-pretty mode-modules generate-go-production test-go 

.PHONY: test-go
test-go:
	go test -cover $(shell go list ./... | grep -v /vendor/) -tags 'production'

.PHONY: test-npm
test-npm: node-modules-react
	cd src; npm run test

.PHONY: test-pretty
test-pretty: node-modules-react
	cd src; npm run prettier-test

.PHONY: node-modules
node-modules: node-modules-react node-modules-legacy

.PHONY: node-modules-react
node-modules-react:
	cd src; npm install --unsafe-perm

.PHONY: node-modules-legacy
node-modules-legacy:
	cd src/legacy; npm install --unsafe-perm

.PHONY: watch-src
watch-src:
	make node-modules
	cd src; npm run watch

.PHONY: vault
vault:
	@echo "$(VAULT_POLICY)"
	@echo "$(TOKEN_INFO)"
	@echo "$(APP_TOKEN)"


.PHONY: clean
clean:
	rm -rf build/ dist/ assets/debug.go assets/prod.go src/node_modules src/legacy/node_modules
