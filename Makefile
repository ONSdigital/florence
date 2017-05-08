BINPATH ?= build
ENABLE_NEW_APP ?= 1

build: generate
	go build -tags 'production' -o $(BINPATH)/florence

debug: generate
	go build -tags 'debug' -o $(BINPATH)/florence
	HUMAN_LOG=1 ENABLE_NEW_APP=${ENABLE_NEW_APP} $(BINPATH)/florence

generate: ${GOPATH}/bin/go-bindata
	# build the production version
	cd assets; ${GOPATH}/bin/go-bindata -o prod.go -pkg assets ../dist/...
	{ echo "// +build production"; cat assets/prod.go; } > assets/prod.go.new
	mv assets/prod.go.new assets/prod.go
	# build the debug version
	cd assets; ${GOPATH}/bin/go-bindata -debug -o debug.go -pkg assets ../dist/...
	{ echo "// +build debug"; cat assets/debug.go; } > assets/debug.go.new
	mv assets/debug.go.new assets/debug.go

test:
	go test -tags 'production'

node-modules:
	cd src; npm install
	cd src/legacy; npm install

watch-src:
	make node-modules
	cd src; npm run watch

${GOPATH}/bin/go-bindata:
	go get -u github.com/jteeuwen/go-bindata/go-bindata

.PHONY: build debug test node-modules watch-src