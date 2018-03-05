package upload

import (
	"bytes"
	"crypto/rsa"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/ONSdigital/go-ns/log"
	"github.com/ONSdigital/s3crypto"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	"github.com/gorilla/schema"
)

// Resumable represents resumable js upload query pararmeters
type Resumable struct {
	ChunkNumber      int    `schema:"resumableChunkNumber"`
	ChunkSize        int    `schema:"resumableChunkSize"`
	CurrentChunkSize int    `schema:"resumableCurrentChunkSize"`
	TotalSize        int    `schema:"resumableTotalSize"`
	Type             string `schema:"resumableType"`
	Identifier       string `schema:"resumableIdentifier"`
	FileName         string `schema:"resumableFilename"`
	RelativePath     string `schema:"resumableRelativePath"`
	TotalChunks      int    `schema:"resumableTotalChunks"`
	AliasName        string `schema:"aliasName"`
}

// New creates a new instance of Uploader using provided s3
// environment authentication
func New(bucketName string, key *rsa.PrivateKey) (*Uploader, error) {
	region := "eu-west-1"

	sess, err := session.NewSession(&aws.Config{Region: &region})
	if err != nil {
		return nil, err
	}

	cryptoConfig := &s3crypto.Config{PrivateKey: key}

	var client s3iface.S3API

	if key == nil {
		client = s3.New(sess)
	} else {
		client = s3crypto.New(sess, cryptoConfig)
	}

	return &Uploader{client, bucketName}, nil
}

// Uploader represents the necessary configuration for uploading a file
type Uploader struct {
	client s3iface.S3API

	bucketName string
}

// CheckUploaded checks to see if a chunk has been uploaded
func (u *Uploader) CheckUploaded(w http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	resum := new(Resumable)

	if err := schema.NewDecoder().Decode(resum, req.Form); err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	listMultiInput := &s3.ListMultipartUploadsInput{
		Bucket: &u.bucketName,
	}

	listMultiOutput, err := u.client.ListMultipartUploads(listMultiInput)
	if err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var uploadID string
	for _, upload := range listMultiOutput.Uploads {
		if *upload.Key == resum.Identifier {
			uploadID = *upload.UploadId
		}
	}

	if len(uploadID) == 0 {
		log.Debug("chunk number not uploaded", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName})
		w.WriteHeader(http.StatusNotFound)
		return
	}

	input := &s3.ListPartsInput{
		Key:      &resum.Identifier,
		Bucket:   &u.bucketName,
		UploadId: &uploadID,
	}

	output, err := u.client.ListParts(input)
	if err != nil {
		log.Debug("chunk number not uploaded", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName})
		w.WriteHeader(http.StatusNotFound)
		return
	}

	parts := output.Parts
	if len(parts) == resum.TotalChunks {
		u.completeUpload(w, req, resum, uploadID, parts)
		return
	}

	for _, part := range parts {
		if *part.PartNumber == int64(resum.ChunkNumber) {
			log.Debug("chunk number already uploaded", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName, "identifier": resum.Identifier})
			w.WriteHeader(http.StatusOK)
			return
		}
	}

	log.Debug("chunk number not uploaded", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName})
	w.WriteHeader(http.StatusNotFound)
}

func (u *Uploader) completeUpload(w http.ResponseWriter, req *http.Request, resum *Resumable, uploadID string, parts []*s3.Part) {
	var completedParts []*s3.CompletedPart

	for _, part := range parts {
		completedParts = append(completedParts, &s3.CompletedPart{
			PartNumber: part.PartNumber,
			ETag:       part.ETag,
		})
	}

	if len(completedParts) == resum.TotalChunks {
		completeInput := &s3.CompleteMultipartUploadInput{
			Key:      &resum.Identifier,
			UploadId: &uploadID,
			MultipartUpload: &s3.CompletedMultipartUpload{
				Parts: completedParts,
			},
			Bucket: &u.bucketName,
		}

		log.Debug("going to attempt to complete", log.Data{"complete": completeInput})

		_, err := u.client.CompleteMultipartUpload(completeInput)
		if err != nil {
			log.ErrorR(req, err, nil)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Trace("uploaded file successfully", log.Data{"file-name": resum.FileName, "uid": resum.Identifier, "size": resum.TotalSize})
	}
}

// Upload handles the uploading a file to AWS s3
func (u *Uploader) Upload(w http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resum := new(Resumable)

	if err := schema.NewDecoder().Decode(resum, req.Form); err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	content, _, err := req.FormFile("file")
	if err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	defer content.Close()

	b, err := ioutil.ReadAll(content)
	if err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	listMultiInput := &s3.ListMultipartUploadsInput{
		Bucket: &u.bucketName,
	}

	listMultiOutput, err := u.client.ListMultipartUploads(listMultiInput)
	if err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var uploadID string

	for _, upload := range listMultiOutput.Uploads {
		if *upload.Key == resum.Identifier {
			uploadID = *upload.UploadId
		}
	}

	if len(uploadID) == 0 {
		acl := "public-read"

		createMultiInput := &s3.CreateMultipartUploadInput{
			Bucket:      &u.bucketName,
			Key:         &resum.Identifier,
			ACL:         &acl,
			ContentType: &resum.Type,
		}

		createMultiOutput, err := u.client.CreateMultipartUpload(createMultiInput)
		if err != nil {
			log.ErrorR(req, err, nil)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		uploadID = *createMultiOutput.UploadId
	}

	rs := bytes.NewReader(b)

	n := int64(resum.ChunkNumber)

	uploadPartInput := &s3.UploadPartInput{
		UploadId:   &uploadID,
		Bucket:     &u.bucketName,
		Key:        &resum.Identifier,
		Body:       rs,
		PartNumber: &n,
	}

	_, err = u.client.UploadPart(uploadPartInput)
	if err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("chunk accepted", log.Data{
		"chunk_number": resum.ChunkNumber,
		"max_chunks":   resum.TotalChunks,
		"file_name":    resum.FileName,
	})

	input := &s3.ListPartsInput{
		Key:      &resum.Identifier,
		Bucket:   &u.bucketName,
		UploadId: &uploadID,
	}

	output, err := u.client.ListParts(input)
	if err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	parts := output.Parts
	if len(parts) == resum.TotalChunks {
		u.completeUpload(w, req, resum, uploadID, parts)
	}
}

// GetS3URL returns an s3 url
func (u *Uploader) GetS3URL(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":id")

	url := "https://s3-%s.amazonaws.com/%s/%s"
	url = fmt.Sprintf(url, "eu-west-1", u.bucketName, path)

	body := struct {
		URL string `json:"url"`
	}{
		URL: url,
	}

	b, err := json.Marshal(body)
	if err != nil {
		log.ErrorR(req, err, nil)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}
