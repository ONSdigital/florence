package assets

import (
	"errors"
	"fmt"
	"hash/crc32"
	"strings"
)

var etags = make(map[string]string)

// ErrETagNotFound is returned when an ETag is not found
var ErrETagNotFound = errors.New("etag not found")

func init() {
	updateETags()
}

func updateETags() {
	for filename, assetFn := range _bindata {
		asset, err := assetFn()
		if err != nil {
			panic("error reading asset file: " + filename)
		}
		crc := crc32.ChecksumIEEE(asset.bytes)
		etags[strings.ToLower(filename)] = fmt.Sprintf(`W/"%d-%08X"`, asset.info.Size(), crc)
	}
}

// GetAssetETag returns an ETag for an asset
func GetAssetETag(path string) (string, error) {
	if tag, ok := etags[strings.ToLower(path)]; ok {
		return tag, nil
	}
	return "", ErrETagNotFound
}
