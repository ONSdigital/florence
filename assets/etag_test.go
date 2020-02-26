package assets

import (
	"os"
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
)

type testBindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

func (fi testBindataFileInfo) Name() string {
	return fi.name
}
func (fi testBindataFileInfo) Size() int64 {
	return fi.size
}
func (fi testBindataFileInfo) Mode() os.FileMode {
	return fi.mode
}
func (fi testBindataFileInfo) ModTime() time.Time {
	return fi.modTime
}
func (fi testBindataFileInfo) IsDir() bool {
	return false
}
func (fi testBindataFileInfo) Sys() interface{} {
	return nil
}

func TestMain(t *testing.T) {
	Convey("ETags generated on startup", t, func() {
		So(etags, ShouldHaveLength, len(_bindata))

		tag, err := GetAssetETag("path/doesnt/exist")
		So(tag, ShouldBeEmpty)
		So(err, ShouldEqual, ErrETagNotFound)

		_bindata["path/does/exist"] = func() (*asset, error) {
			return &asset{
				bytes: []byte("test"),
				info:  testBindataFileInfo{"test", 4, 0600, time.Now()},
			}, nil
		}

		updateETags()

		tag, err = GetAssetETag("path/does/exist")
		So(tag, ShouldEqual, `W/"4-D87F7E0C"`)
		So(err, ShouldBeNil)
	})
}
