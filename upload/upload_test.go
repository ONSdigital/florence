package upload_test

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	s3client "github.com/ONSdigital/dp-s3"
	"github.com/ONSdigital/florence/upload"
	"github.com/ONSdigital/florence/upload/mock"

	. "github.com/smartystreets/goconvey/convey"
)

var (
	vaultRootPath = "secret/path"
	vaultKey      = "key"

	expectedPayload = []byte(`some test file bytes to be uploaded`)
)

func TestGetUpload(t *testing.T) {

	Convey("given a GET /upload request", t, func() {

		w := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/upload", nil)
		So(err, ShouldBeNil)

		Convey("A 404 http status code is returned if chunk has not yet been uploaded", func() {

			addQueryParams(req, "1", "1")

			// S3 client returns ErrNotUploaded if uploadID cannot be found
			s3 := &mock.S3ClientMock{
				CheckPartUploadedFunc: func(ctx context.Context, req *s3client.UploadPartRequest) (bool, error) {
					return false, &s3client.ErrNotUploaded{UploadKey: req.UploadKey}
				},
			}

			// Instantiate Upload with mock, and call Upload
			up := upload.New(s3, nil, "")
			up.CheckUploaded(w, req)

			// Validations
			So(len(s3.CheckPartUploadedCalls()), ShouldEqual, 1)
			So(s3.CheckPartUploadedCalls()[0].Req, ShouldResemble, &s3client.UploadPartRequest{
				UploadKey:   "12345",
				Type:        "text/plain",
				ChunkNumber: 1,
				TotalChunks: 1,
				FileName:    "helloworld",
			})
			So(w.Code, ShouldEqual, 404)
		})

		Convey("A 200 http status code is returned if chunk has been uploaded", func() {

			addQueryParams(req, "1", "2")

			// S3 client returns true if upload could be found and chunk was already uploaded
			s3 := &mock.S3ClientMock{
				CheckPartUploadedFunc: func(ctx context.Context, req *s3client.UploadPartRequest) (bool, error) {
					return true, nil
				},
			}

			// Instantiate Upload with mock, and call Upload
			up := upload.New(s3, nil, "")
			up.CheckUploaded(w, req)

			// Validations
			So(len(s3.CheckPartUploadedCalls()), ShouldEqual, 1)
			So(s3.CheckPartUploadedCalls()[0].Req, ShouldResemble, &s3client.UploadPartRequest{
				UploadKey:   "12345",
				Type:        "text/plain",
				ChunkNumber: 1,
				TotalChunks: 2,
				FileName:    "helloworld",
			})
			So(w.Code, ShouldEqual, 200)
		})

		Convey("A 500 http status code is returned if multi part upload fails", func() {

			addQueryParams(req, "1", "1")

			// S3 client returns generic error if ListMultipartUploads fails
			s3 := &mock.S3ClientMock{
				CheckPartUploadedFunc: func(ctx context.Context, req *s3client.UploadPartRequest) (bool, error) {
					return false, errors.New("could not list uploads")
				},
			}

			// Instantiate Upload with mock, and call Upload
			up := upload.New(s3, nil, "")
			up.CheckUploaded(w, req)

			// Validations
			So(len(s3.CheckPartUploadedCalls()), ShouldEqual, 1)
			So(s3.CheckPartUploadedCalls()[0].Req, ShouldResemble, &s3client.UploadPartRequest{
				UploadKey:   "12345",
				Type:        "text/plain",
				ChunkNumber: 1,
				TotalChunks: 1,
				FileName:    "helloworld",
			})
			So(w.Code, ShouldEqual, 500)
		})
	})
}

func TestPostUpload(t *testing.T) {

	Convey("given a POST /upload request", t, func() {

		w := httptest.NewRecorder()
		req, err := createTestFileUploadPart(expectedPayload)
		So(err, ShouldBeNil)

		Convey("test upload successfully uploads with only one chunk and no vault client", func() {

			addQueryParams(req, "1", "1")

			// S3 client returns generic error if ListMultipartUploads fails
			s3 := &mock.S3ClientMock{
				UploadPartFunc: func(ctx context.Context, req *s3client.UploadPartRequest, payload []byte) error {
					return nil
				},
			}

			// Instantiate Upload with mock, and call Upload
			up := upload.New(s3, nil, "")
			up.Upload(w, req)

			// Validations
			So(len(s3.UploadPartCalls()), ShouldEqual, 1)
			So(s3.UploadPartCalls()[0].Req, ShouldResemble, &s3client.UploadPartRequest{
				UploadKey:   "12345",
				Type:        "text/plain",
				ChunkNumber: 1,
				TotalChunks: 1,
				FileName:    "helloworld",
			})
			So(s3.UploadPartCalls()[0].Payload, ShouldResemble, expectedPayload)
			So(w.Code, ShouldEqual, 200)

		})

		Convey("test upload successfully uploads with only one chunk and a valid vault client with no existing PSK", func() {

			addQueryParams(req, "1", "1")

			// S3 client returns generic error if ListMultipartUploads fails
			s3 := &mock.S3ClientMock{
				UploadPartWithPskFunc: func(ctx context.Context, req *s3client.UploadPartRequest, payload []byte, psk []byte) error {
					return nil
				},
			}

			// Vault client mock
			vc := &mock.VaultClientMock{
				ReadKeyFunc: func(path string, key string) (string, error) {
					return "", errors.New("no key created yet - better go create one")
				},
				WriteKeyFunc: func(path string, key string, value string) error {
					return nil
				},
			}

			// Instantiate Upload with mocks, and call Upload
			up := upload.New(s3, vc, vaultRootPath)
			up.Upload(w, req)

			// Validations
			So(len(s3.UploadPartWithPskCalls()), ShouldEqual, 1)
			So(s3.UploadPartWithPskCalls()[0].Req, ShouldResemble, &s3client.UploadPartRequest{
				UploadKey:   "12345",
				Type:        "text/plain",
				ChunkNumber: 1,
				TotalChunks: 1,
				FileName:    "helloworld",
			})
			So(s3.UploadPartWithPskCalls()[0].Payload, ShouldResemble, expectedPayload)
			So(len(s3.UploadPartWithPskCalls()[0].Psk), ShouldEqual, 16)
			So(len(vc.ReadKeyCalls()), ShouldEqual, 1)
			So(len(vc.WriteKeyCalls()), ShouldEqual, 1)
			So(w.Code, ShouldEqual, 200)
		})

		Convey("test upload successfully uploads with only one chunk and a valid vault client with existing PSK", func() {

			addQueryParams(req, "1", "1")

			// S3 client returns generic error if ListMultipartUploads fails
			s3 := &mock.S3ClientMock{
				UploadPartWithPskFunc: func(ctx context.Context, req *s3client.UploadPartRequest, payload []byte, psk []byte) error {
					return nil
				},
			}

			// The expected vault path is the root path plus the S3 Key (i.e. path in bucket) of the upload request
			vaultPath := vaultRootPath + "/12345"
			encodedPSK := "48656C6C6F20576F726C64"
			psk, err := hex.DecodeString(encodedPSK)

			// Vault client mock
			So(err, ShouldBeNil)
			vc := &mock.VaultClientMock{
				ReadKeyFunc: func(path string, key string) (string, error) {
					return encodedPSK, nil
				},
			}

			// Instantiate Upload with mocks, and call Upload
			up := upload.New(s3, vc, vaultRootPath)
			up.Upload(w, req)

			// Validations
			So(len(s3.UploadPartWithPskCalls()), ShouldEqual, 1)
			So(s3.UploadPartWithPskCalls()[0].Req, ShouldResemble, &s3client.UploadPartRequest{
				UploadKey:   "12345",
				Type:        "text/plain",
				ChunkNumber: 1,
				TotalChunks: 1,
				FileName:    "helloworld",
			})
			So(s3.UploadPartWithPskCalls()[0].Payload, ShouldResemble, expectedPayload)
			So(s3.UploadPartWithPskCalls()[0].Psk, ShouldResemble, psk)
			So(len(vc.ReadKeyCalls()), ShouldEqual, 1)
			So(vc.ReadKeyCalls()[0].Path, ShouldEqual, vaultPath)
			So(w.Code, ShouldEqual, 200)
		})

		Convey("test 500 status returned if client throws an error", func() {

			addQueryParams(req, "1", "1")

			// S3 client returns generic error if ListMultipartUploads fails
			s3 := &mock.S3ClientMock{
				UploadPartFunc: func(ctx context.Context, req *s3client.UploadPartRequest, payload []byte) error {
					return errors.New("could not list uploads")
				},
			}

			// Instantiate Upload with mock, and call Upload
			up := upload.New(s3, nil, "")
			up.Upload(w, req)

			// Validations
			So(len(s3.UploadPartCalls()), ShouldEqual, 1)
			So(s3.UploadPartCalls()[0].Req, ShouldResemble, &s3client.UploadPartRequest{
				UploadKey:   "12345",
				Type:        "text/plain",
				ChunkNumber: 1,
				TotalChunks: 1,
				FileName:    "helloworld",
			})
			So(w.Code, ShouldEqual, 500)

		})

	})

}

func TestGetS3Url(t *testing.T) {

	Convey("Given a GET /upload request with a path parameter", t, func() {

		w := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/upload?:id=173849-helloworldtxt", nil)
		So(err, ShouldBeNil)

		Convey("A 200 OK status is returned, with the fully qualified s3 url for the region, bucket and s3 key", func() {

			// S3 client returns URL for test-bucket and eu-west-1 region
			s3 := &mock.S3ClientMock{
				GetPathStyleURLFunc: func(path string) string {
					return fmt.Sprintf("https://s3-eu-west-1.amazonaws.com/test-bucket/%s", path)
				},
			}

			// Instantiate Upload with mock, and call GetS3URL
			up := upload.New(s3, nil, "173849-helloworldtxt")
			up.GetS3URL(w, req)

			// Validations
			So(w.Code, ShouldEqual, 200)
			So(w.Body.String(), ShouldEqual, `{"url":"https://s3-eu-west-1.amazonaws.com/test-bucket/173849-helloworldtxt"}`)
			So(len(s3.GetPathStyleURLCalls()), ShouldEqual, 1)
			So(s3.GetPathStyleURLCalls()[0].Path, ShouldEqual, "173849-helloworldtxt")
			So(w.Header().Get("Content-Type"), ShouldEqual, "application/json")
		})
	})
}

// createTestFileUploadPart creates an http Request with the expected body payload
func createTestFileUploadPart(testPayload []byte) (*http.Request, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", "helloworld.txt")
	if err != nil {
		return nil, err
	}

	if _, err = part.Write(testPayload); err != nil {
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
