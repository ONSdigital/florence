package upload

import (
	"bytes"
	"errors"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ONSdigital/florence/upload/mocks"
	"github.com/aws/aws-sdk-go/service/s3"

	"github.com/golang/mock/gomock"
	. "github.com/smartystreets/goconvey/convey"
)

var (
	testBucketName = "test-bucket"
	vaultRootPath  = "secret/path"
	vaultKey       = "key"
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

			client := mocks.NewMockS3Client(mockCtrl)
			client.EXPECT().ListMultipartUploads(&s3.ListMultipartUploadsInput{Bucket: &testBucketName}).Return(&s3.ListMultipartUploadsOutput{}, nil)

			up := Uploader{client: client, bucketName: testBucketName, vaultPath: vaultRootPath}

			up.CheckUploaded(w, req)

			So(w.Code, ShouldEqual, 404)
		})

		Convey("test CheckUpload returns 200 if chunk has been uploaded", func() {
			w := httptest.NewRecorder()
			req, err := http.NewRequest("GET", "/upload", nil)
			So(err, ShouldBeNil)

			addQueryParams(req, "1", "2")

			key := "12345"
			id := "test-id"

			client := mocks.NewMockS3Client(mockCtrl)
			client.EXPECT().ListMultipartUploads(&s3.ListMultipartUploadsInput{Bucket: &testBucketName}).Return(&s3.ListMultipartUploadsOutput{
				Uploads: []*s3.MultipartUpload{
					{
						Key:      &key,
						UploadId: &id,
					},
				},
			}, nil)
			n := int64(1)
			client.EXPECT().ListParts(&s3.ListPartsInput{Key: &key, Bucket: &testBucketName, UploadId: &id}).Return(&s3.ListPartsOutput{
				Parts: []*s3.Part{
					{
						PartNumber: &n,
					},
				},
			}, nil)

			up := Uploader{client: client, bucketName: testBucketName}

			up.CheckUploaded(w, req)

			So(w.Code, ShouldEqual, 200)
		})

		Convey("test CheckUpload returns status 500 if multi part upload fails", func() {
			w := httptest.NewRecorder()
			req, err := http.NewRequest("GET", "/upload", nil)
			So(err, ShouldBeNil)

			addQueryParams(req, "1", "1")

			client := mocks.NewMockS3Client(mockCtrl)
			client.EXPECT().ListMultipartUploads(&s3.ListMultipartUploadsInput{Bucket: &testBucketName}).Return(nil, errors.New("could not list uploads"))

			up := Uploader{client: client, bucketName: testBucketName}

			up.CheckUploaded(w, req)

			So(w.Code, ShouldEqual, 500)
		})
	})

	Convey("test Upload", t, func() {
		Convey("test upload successfully uploads with only one chunk and no vault client", func() {
			w := httptest.NewRecorder()

			req, err := createTestFileUploadPart()
			So(err, ShouldBeNil)

			addQueryParams(req, "1", "1")

			client := mocks.NewMockS3Client(mockCtrl)
			client.EXPECT().ListMultipartUploads(&s3.ListMultipartUploadsInput{Bucket: &testBucketName}).Return(&s3.ListMultipartUploadsOutput{}, nil)

			key := "12345"
			id := "test-id"
			contentType := "text/plain"

			client.EXPECT().CreateMultipartUpload(&s3.CreateMultipartUploadInput{
				Bucket:      &testBucketName,
				Key:         &key,
				ContentType: &contentType,
			}).Return(&s3.CreateMultipartUploadOutput{UploadId: &id}, nil)

			n := int64(1)

			client.EXPECT().UploadPart(&s3.UploadPartInput{
				UploadId:   &id,
				Bucket:     &testBucketName,
				Key:        &key,
				Body:       bytes.NewReader([]byte(`some test file bytes to be uploaded`)),
				PartNumber: &n,
			}).Return(nil, nil)

			etag := "abcdefg"

			client.EXPECT().ListParts(&s3.ListPartsInput{
				Key:      &key,
				Bucket:   &testBucketName,
				UploadId: &id,
			}).Return(&s3.ListPartsOutput{
				Parts: []*s3.Part{
					{
						ETag:       &etag,
						PartNumber: &n,
					},
				},
			}, nil)

			client.EXPECT().CompleteMultipartUpload(&s3.CompleteMultipartUploadInput{
				Key:      &key,
				UploadId: &id,
				MultipartUpload: &s3.CompletedMultipartUpload{
					Parts: []*s3.CompletedPart{
						{
							ETag:       &etag,
							PartNumber: &n,
						},
					},
				},
				Bucket: &testBucketName,
			}).Return(nil, nil)

			up := Uploader{client: client, bucketName: testBucketName}

			up.Upload(w, req)

			So(w.Code, ShouldEqual, 200)

		})

		Convey("test upload successfully uploads with only one chunk and a valid vault client", func() {
			w := httptest.NewRecorder()

			req, err := createTestFileUploadPart()
			So(err, ShouldBeNil)

			addQueryParams(req, "1", "1")

			key := "12345"
			id := "test-id"
			contentType := "text/plain"
			encodedPSK := "48656C6C6F20576F726C64"
			psk := []byte("Hello World")

			client := mocks.NewMockS3Client(mockCtrl)
			client.EXPECT().ListMultipartUploads(&s3.ListMultipartUploadsInput{Bucket: &testBucketName}).Return(&s3.ListMultipartUploadsOutput{}, nil)

			vault := mocks.NewMockVaultClient(mockCtrl)

			vaultPath := vaultRootPath + "/" + key
			vault.EXPECT().ReadKey(vaultPath, vaultKey).Return("", errors.New("no key created yet- better go create one"))
			vault.EXPECT().WriteKey(vaultPath, vaultKey, gomock.Any()).Return(nil)
			vault.EXPECT().ReadKey(vaultPath, vaultKey).Return(encodedPSK, nil)

			client.EXPECT().CreateMultipartUpload(&s3.CreateMultipartUploadInput{
				Bucket:      &testBucketName,
				Key:         &key,
				ContentType: &contentType,
			}).Return(&s3.CreateMultipartUploadOutput{UploadId: &id}, nil)

			n := int64(1)

			client.EXPECT().UploadPartWithPSK(&s3.UploadPartInput{
				UploadId:   &id,
				Bucket:     &testBucketName,
				Key:        &key,
				Body:       bytes.NewReader([]byte(`some test file bytes to be uploaded`)),
				PartNumber: &n,
			}, psk).Return(nil, nil)

			etag := "abcdefg"

			client.EXPECT().ListParts(&s3.ListPartsInput{
				Key:      &key,
				Bucket:   &testBucketName,
				UploadId: &id,
			}).Return(&s3.ListPartsOutput{
				Parts: []*s3.Part{
					{
						ETag:       &etag,
						PartNumber: &n,
					},
				},
			}, nil)

			client.EXPECT().CompleteMultipartUpload(&s3.CompleteMultipartUploadInput{
				Key:      &key,
				UploadId: &id,
				MultipartUpload: &s3.CompletedMultipartUpload{
					Parts: []*s3.CompletedPart{
						{
							ETag:       &etag,
							PartNumber: &n,
						},
					},
				},
				Bucket: &testBucketName,
			}).Return(nil, nil)

			up := Uploader{client: client, vaultClient: vault, bucketName: testBucketName, vaultPath: vaultRootPath}

			up.Upload(w, req)

			So(w.Code, ShouldEqual, 200)

		})

		Convey("test 500 status returned if client throws an error", func() {
			w := httptest.NewRecorder()

			req, err := createTestFileUploadPart()
			So(err, ShouldBeNil)

			addQueryParams(req, "1", "1")

			client := mocks.NewMockS3Client(mockCtrl)
			client.EXPECT().ListMultipartUploads(&s3.ListMultipartUploadsInput{Bucket: &testBucketName}).Return(nil, errors.New("could not list uploads"))

			up := Uploader{client: client, bucketName: testBucketName}

			up.Upload(w, req)

			So(w.Code, ShouldEqual, 500)

		})
	})

	Convey("test GetS3URL", t, func() {
		Convey("test GetS3URL forms an s3 url and returns status 200", func() {
			w := httptest.NewRecorder()
			req, err := http.NewRequest("GET", "/upload?:id=173849-helloworldtxt", nil)
			So(err, ShouldBeNil)

			up := Uploader{bucketName: testBucketName}

			up.GetS3URL(w, req)
			So(w.Code, ShouldEqual, 200)
			So(w.Body.String(), ShouldEqual, `{"url":"https://s3-eu-west-1.amazonaws.com/test-bucket/173849-helloworldtxt"}`)
			So(w.Header().Get("Content-Type"), ShouldEqual, "application/json")
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
