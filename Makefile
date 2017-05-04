ENABLE_NEW_APP ?= 1

build: assets/bin-data.go
	go build -o build/florence

debug:
	cd assets; go-bindata -ignore=node_modules -debug -o bin-data.go -pkg assets ../dist/...
	go build -o build/florence
	HUMAN_LOG=1 ENABLE_NEW_APP=${ENABLE_NEW_APP} ./build/florence

test:
	go test

node-modules:
	cd src; npm install
	cd src/legacy; npm install

watch-src:
	make node-modules
	cd src; npm run watch

assets/bin-data.go:
	go generate ./...

.PHONY: build debug test watch-src