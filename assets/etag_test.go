package assets

import (
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
)

func TestMain(t *testing.T) {
	Convey("ETags generated on startup", t, func() {
		So(etags, ShouldHaveLength, len(_bindata))

		tag, err := GetAssetETag("path/doesnt/exist")
		So(tag, ShouldBeEmpty)
		So(err, ShouldEqual, ErrETagNotFound)

		_bindata["path/does/exist"] = func() (*asset, error) {
			return &asset{
				bytes: []byte("test"),
				info:  bindataFileInfo{"test", 4, 0600, time.Now()},
			}, nil
		}

		updateETags()

		tag, err = GetAssetETag("path/does/exist")
		So(tag, ShouldEqual, `W/"4-D87F7E0C"`)
		So(err, ShouldBeNil)
	})
}
