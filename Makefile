BIND_ADDR ?= :8081
BINPATH ?= build
NVM_SOURCE_PATH ?= $(HOME)/.nvm/nvm.sh

ifneq ("$(wildcard $(NVM_SOURCE_PATH))","")
	NVM_EXEC = source $(NVM_SOURCE_PATH) && nvm exec --
endif
NPM = $(NVM_EXEC) npm

BUILD_TIME=$(shell date +%s)
GIT_COMMIT=$(shell git rev-parse HEAD)
VERSION ?= $(shell git tag --points-at HEAD | grep ^v | head -n 1)
LDFLAGS=-ldflags "-w -s -X 'main.Version=${VERSION}' -X 'main.BuildTime=$(BUILD_TIME)' -X 'main.GitCommit=$(GIT_COMMIT)'"


.PHONY: audit
audit: audit-js audit-go

.PHONY: audit-go
audit-go:
	go list -m all | nancy sleuth

.PHONY: audit-js
audit-js: audit-js-react audit-js-legacy

.PHONY: audit-js-react
audit-js-react: node-modules-react
	cd src; $(NPM) run audit

.PHONY: audit-js-legacy
audit-js-legacy: node-modules-legacy
	cd src/legacy; $(NPM) run audit

.PHONY: build
build: node-modules generate-go-prod
	go build $(LDFLAGS) -tags 'production' -o $(BINPATH)/florence

.PHONY: dev
dev: node-modules generate-go-debug
	go build $(LDFLAGS) -tags 'debug' -o $(BINPATH)/florence
	HUMAN_LOG=1 BIND_ADDR=${BIND_ADDR} $(BINPATH)/florence

.PHONY: debug
debug: generate-go-debug
	go build $(LDFLAGS) -tags 'debug' -o $(BINPATH)/florence
	HUMAN_LOG=1 BIND_ADDR=${BIND_ADDR} $(BINPATH)/florence

.PHONY: debug-run
debug-run: generate-go-debug
	HUMAN_LOG=1 BIND_ADDR=${BIND_ADDR} go run -tags 'debug' -race $(LDFLAGS) main.go

.PHONY: ensure-main-min-css
ensure-main-min-css:
    # Sleeping for a bit if necessary as a workaround to allow time for main.min.css to finish writing
	bash -c 'for i in {1..10} ; do if [ -e dist/legacy-assets/css/main.min.css ] ; then break ; fi ; echo "Waiting for main.min.css" ; sleep 2 ; done'

.PHONY: generate-go-prod
generate-go-prod: ensure-main-min-css
	# Generate the production assets version
	cd assets; find ../dist/ -type f ; go run github.com/jteeuwen/go-bindata/go-bindata -o data.go -pkg assets ../dist/...

.PHONY: generate-go-debug
generate-go-debug:
	# Generate the debug assets version
	cd assets; go run github.com/jteeuwen/go-bindata/go-bindata -debug -o data.go -pkg assets ../dist/...

.PHONY: generate-go-mock
generate-go-mock:
	# This fakes the creation of bindata to use for linting.
	cd assets; go run github.com/jteeuwen/go-bindata/go-bindata -debug -o data.go -pkg assets ./...

.PHONY: lint
lint: lint-js lint-go

.PHONY: lint-go
lint-go: generate-go-mock
	golangci-lint run ./...

.PHONY: lint-js 
lint-js: node-modules lint-js-react lint-js-legacy

.PHONY: lint-js-react
lint-js-react: node-modules-react
	cd src; $(NPM) run eslint-check

.PHONY: lint-js-legacy
lint-js-legacy:
	cd src/legacy; $(NPM) run eslint-check

.PHONY: test
test: test-npm test-pretty node-modules test-go

.PHONY: test-go
test-go: generate-go-prod
	go test -race -cover ./...

.PHONY: test-npm
test-npm: node-modules-react
	cd src; $(NPM) run test

.PHONY: test-pretty
test-pretty: node-modules-react
	cd src; $(NPM) run prettier-test

.PHONY: node-modules
node-modules: node-modules-react node-modules-legacy

.PHONY: node-modules-react
node-modules-react:
	cd src; $(NPM) install --unsafe-perm --legacy-peer-deps

.PHONY: node-modules-legacy
node-modules-legacy:
	cd src/legacy; $(NPM) install --unsafe-perm --legacy-peer-deps

.PHONY: watch-src
watch-src:
	make node-modules
	cd src; $(NPM) run watch

.PHONY: clean
clean:
	rm -rf build/ dist/ assets/data.go src/node_modules src/legacy/node_modules


.PHONY: test-component
test-component: node-modules generate-go-prod
	go test -cover -coverpkg=github.com/ONSdigital/florence/... -component
