//go:generate go get -u github.com/jteeuwen/go-bindata/go-bindata
//go:generate go-bindata -ignore=node_modules -o prod.go -pkg assets ../dist/...

package assets
