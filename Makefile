BIND_ADDR ?= :8081
BINPATH ?= build

VERSION=`git describe --tags`
LDFLAGS=-ldflags "-w -s -X main.Version=${VERSION}"

build: generate
	go build $(LDFLAGS) -tags 'production' -o $(BINPATH)/florence

debug: generate
	go build $(LDFLAGS) -tags 'debug' -o $(BINPATH)/florence
	MONGO_URI=${MONGO_URI} HUMAN_LOG=1 BIND_ADDR=${BIND_ADDR} $(BINPATH)/florence

generate: ${GOPATH}/bin/go-bindata
	# build the production version
	cd assets; ${GOPATH}/bin/go-bindata -o prod.go -pkg assets ../dist/...
	{ echo "// +build production"; cat assets/prod.go; } > assets/prod.go.new
	mv assets/prod.go.new assets/prod.go
	# build the debug version
	cd assets; ${GOPATH}/bin/go-bindata -debug -o debug.go -pkg assets ../dist/...
	{ echo "// +build debug"; cat assets/debug.go; } > assets/debug.go.new
	mv assets/debug.go.new assets/debug.go

test: test-go test-npm

test-go:
	go test -cover $(shell go list ./... | grep -v /vendor/) -tags 'production'

test-npm:
	cd src; npm install && npm run test

node-modules:
	cd src; npm install
	cd src/legacy; npm install

watch-src:
	make node-modules
	cd src; npm run watch

${GOPATH}/bin/go-bindata:
	go get -u github.com/jteeuwen/go-bindata/go-bindata

.PHONY: build debug test node-modules watch-src
