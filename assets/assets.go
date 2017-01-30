//go:generate go get github.com/jteeuwen/go-bindata/go-bindata
//go:generate go-bindata -ignore=node_modules -o bin-data.go -pkg assets ../src/assets/...

package assets
