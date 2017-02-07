build: assets/bin-data.go
	go build -o build/florence

debug:
	cd assets; go-bindata -ignore=node_modules -debug -o bin-data.go -pkg assets ../dist/...
	go build -o build/florence
	HUMAN_LOG=1 ./build/florence

assets/bin-data.go:
	go generate ./...

.PHONY: build debug