package upload

import (
	"bytes"
	"errors"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	"gopkg.in/amz.v1/s3"

	"github.com/golang/mock/gomock"
	. "github.com/smartystreets/goconvey/convey"
)

func TestUnitUpload(t *testing.T) {
	mockCtrl := gomock.NewController(t)
	defer mockCtrl.Finish()

	Convey("test CheckUpload", t, func() {
		Convey("test CheckUploaded returns 404 if chunk has not yet been uploaded", func() {
			w := httptest.NewRecorder()
			req, err := http.NewRequest("GET", "/upload", nil)
			So(err, ShouldBeNil)

			addQueryParams(req, "1", "1")

			mockBucket := NewMockBucket(mockCtrl)
			mockMulti := NewMockMulti(mockCtrl)
			mockBucket.EXPECT().Multi("12345", "text/plain", s3.ACL("public-read")).Return(mockMulti, nil)
			mockMulti.EXPECT().ListParts().Return([]s3.Part{
				{
					N: 6,
				},
			}, nil)

			up := Uploader{mockBucket}

			up.CheckUploaded(w, req)

			So(w.Code, ShouldEqual, 404)
		})

		Convey("test CheckUpload returns 200 if chunk has been uploaded", func() {
			w := httptest.NewRecorder()
			req, err := http.NewRequest("GET", "/upload", nil)
			So(err, ShouldBeNil)

			addQueryParams(req, "6", "1")

			mockBucket := NewMockBucket(mockCtrl)
			mockMulti := NewMockMulti(mockCtrl)
			mockBucket.EXPECT().Multi("12345", "text/plain", s3.ACL("public-read")).Return(mockMulti, nil)
			mockMulti.EXPECT().ListParts().Return([]s3.Part{
				{
					N: 6,
				},
			}, nil)
			mockMulti.EXPECT().Complete([]s3.Part{
				{
					N: 6,
				},
			}).Return(nil)

			up := Uploader{mockBucket}

			up.CheckUploaded(w, req)

			So(w.Code, ShouldEqual, 200)
		})

		Convey("test CheckUpload returns status 500 if multi part upload fails", func() {
			w := httptest.NewRecorder()
			req, err := http.NewRequest("GET", "/upload", nil)
			So(err, ShouldBeNil)

			addQueryParams(req, "6", "1")

			mockBucket := NewMockBucket(mockCtrl)
			mockMulti := NewMockMulti(mockCtrl)
			mockBucket.EXPECT().Multi("12345", "text/plain", s3.ACL("public-read")).Return(mockMulti, nil)
			mockMulti.EXPECT().ListParts().Return([]s3.Part{
				{
					N: 6,
				},
			}, nil)
			mockMulti.EXPECT().Complete([]s3.Part{
				{
					N: 6,
				},
			}).Return(errors.New("something went wrong *sad face*"))
			mockMulti.EXPECT().Abort().Return(errors.New("something went wrong aborting too :("))

			up := Uploader{mockBucket}

			up.CheckUploaded(w, req)

			So(w.Code, ShouldEqual, 500)
		})
	})

	Convey("test Upload", t, func() {
		Convey("test upload successfully uploads with only one chunk", func() {
			w := httptest.NewRecorder()

			req, err := createTestFileUploadPart()
			So(err, ShouldBeNil)

			addQueryParams(req, "1", "1")

			mockBucket := NewMockBucket(mockCtrl)
			mockBucket.EXPECT().Put("12345", []byte(`some test file bytes to be uploaded`), "text/plain", s3.ACL("public-read"))

			up := Uploader{mockBucket}

			up.Upload(w, req)

			So(w.Code, ShouldEqual, 200)
		})

		Convey("test chunk is accepted successfully in multi part upload", func() {
			w := httptest.NewRecorder()

			req, err := createTestFileUploadPart()
			So(err, ShouldBeNil)

			addQueryParams(req, "2", "2")

			mockBucket := NewMockBucket(mockCtrl)
			mockMulti := NewMockMulti(mockCtrl)
			mockBucket.EXPECT().Multi("12345", "text/plain", s3.ACL("public-read")).Return(mockMulti, nil)
			mockMulti.EXPECT().ListParts().Return([]s3.Part{
				{
					N: 2,
				},
			}, nil)
			mockMulti.EXPECT().PutPart(2, bytes.NewReader([]byte(`some test file bytes to be uploaded`)))

			up := Uploader{mockBucket}

			up.Upload(w, req)

			So(w.Code, ShouldEqual, 200)
		})
	})

}

func createTestFileUploadPart() (*http.Request, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", "helloworld.txt")
	if err != nil {
		return nil, err
	}

	if _, err = part.Write([]byte(`some test file bytes to be uploaded`)); err != nil {
		return nil, err
	}
	err = writer.Close()
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", "/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	return req, err
}

func addQueryParams(req *http.Request, chunkNumber, maxChunks string) {
	q := req.URL.Query()
	q.Add("resumableChunkNumber", chunkNumber)
	q.Add("resumableChunkSize", "5242880")
	q.Add("resumableCurrentChunkSize", "5242880")
	q.Add("resumableTotalSize", "5242880")
	q.Add("resumableType", "text/plain")
	q.Add("resumableIdentifier", "12345")
	q.Add("resumableFilename", "helloworld")
	q.Add("resumableRelativePath", ".")
	q.Add("resumableTotalChunks", maxChunks)
	req.URL.RawQuery = q.Encode()
}
