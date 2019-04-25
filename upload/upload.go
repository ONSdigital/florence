package upload

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/ONSdigital/log.go/log"
	"github.com/ONSdigital/s3crypto"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
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

// S3Client wraps the SDK Client and the CryptoClients
type S3Client interface {
	S3SDKClient
	S3CryptoClient
}

// S3Client implements the S3Client interface
type s3Client struct {
	S3SDKClient
	S3CryptoClient
}

// S3SDKClient represents the client with methods required to upload a multipart upload to s3
type S3SDKClient interface {
	ListMultipartUploads(*s3.ListMultipartUploadsInput) (*s3.ListMultipartUploadsOutput, error)
	ListParts(*s3.ListPartsInput) (*s3.ListPartsOutput, error)
	CompleteMultipartUpload(input *s3.CompleteMultipartUploadInput) (*s3.CompleteMultipartUploadOutput, error)
	CreateMultipartUpload(*s3.CreateMultipartUploadInput) (*s3.CreateMultipartUploadOutput, error)
	UploadPart(*s3.UploadPartInput) (*s3.UploadPartOutput, error)
}

// S3CryptoClient represents the cryptoclient with methods required to upload parts with encryption
type S3CryptoClient interface {
	UploadPartWithPSK(*s3.UploadPartInput, []byte) (*s3.UploadPartOutput, error)
}

// VaultClient is an interface to represent methods called to action upon vault
type VaultClient interface {
	ReadKey(path, key string) (string, error)
	WriteKey(path, key, value string) error
}

// New creates a new instance of Uploader using provided s3
// environment authentication
func New(bucketName, vaultPath string, vc VaultClient) (*Uploader, error) {
	region := "eu-west-1"

	sess, err := session.NewSession(&aws.Config{Region: &region})
	if err != nil {
		return nil, err
	}

	s3cli := s3.New(sess)

	client := s3Client{
		S3SDKClient: s3cli,
	}

	if vc != nil {
		cryptoConfig := &s3crypto.Config{HasUserDefinedPSK: true}
		s3cryptoClient := s3crypto.New(sess, cryptoConfig)

		client.S3CryptoClient = s3cryptoClient
	}

	return &Uploader{client, vc, bucketName, vaultPath}, nil
}

// Uploader represents the necessary configuration for uploading a file
type Uploader struct {
	client      S3Client
	vaultClient VaultClient

	bucketName string
	vaultPath  string
}

// CheckUploaded checks to see if a chunk has been uploaded
func (u *Uploader) CheckUploaded(w http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		log.Event(req.Context(), "error parsing form", log.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	resum := new(Resumable)

	if err := schema.NewDecoder().Decode(resum, req.Form); err != nil {
		log.Event(req.Context(), "error decoding form", log.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	listMultiInput := &s3.ListMultipartUploadsInput{
		Bucket: &u.bucketName,
	}

	listMultiOutput, err := u.client.ListMultipartUploads(listMultiInput)
	if err != nil {
		log.Event(req.Context(), "error fetching multipart upload list", log.Error(err))
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
		log.Event(req.Context(), "chunk number not uploaded", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName})
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
		log.Event(req.Context(), "chunk number verification error", log.Error(err), log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName})
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
			log.Event(req.Context(), "chunk number already uploaded", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName, "identifier": resum.Identifier})
			w.WriteHeader(http.StatusOK)
			return
		}
	}

	log.Event(req.Context(), "chunk number failed to upload", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName})
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

		log.Event(req.Context(), "going to attempt to complete", log.Data{"complete": completeInput})

		_, err := u.client.CompleteMultipartUpload(completeInput)
		if err != nil {
			log.Event(req.Context(), "error completing upload", log.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Event(req.Context(), "uploaded file successfully", log.Data{"file-name": resum.FileName, "uid": resum.Identifier, "size": resum.TotalSize})
	}
}

// Upload handles the uploading a file to AWS s3
func (u *Uploader) Upload(w http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		log.Event(req.Context(), "error parsing form", log.Error(err))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resum := new(Resumable)

	if err := schema.NewDecoder().Decode(resum, req.Form); err != nil {
		log.Event(req.Context(), "error decoding form", log.Error(err))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	content, _, err := req.FormFile("file")
	if err != nil {
		log.Event(req.Context(), "error getting file from form", log.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	defer content.Close()

	b, err := ioutil.ReadAll(content)
	if err != nil {
		log.Event(req.Context(), "error reading file", log.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	listMultiInput := &s3.ListMultipartUploadsInput{
		Bucket: &u.bucketName,
	}

	listMultiOutput, err := u.client.ListMultipartUploads(listMultiInput)
	if err != nil {
		log.Event(req.Context(), "error fetching multipart list", log.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var uploadID string

	for _, upload := range listMultiOutput.Uploads {
		if *upload.Key == resum.Identifier {
			uploadID = *upload.UploadId
		}
	}

	vaultKey := "key"
	vaultPath := u.vaultPath + "/" + resum.Identifier

	if u.vaultClient != nil {
		// If the vault key is not found for this file then create one, otherwise assume it exists
		if _, err := u.vaultClient.ReadKey(vaultPath, vaultKey); err != nil {
			psk := createPSK()

			if err := u.vaultClient.WriteKey(vaultPath, vaultKey, hex.EncodeToString(psk)); err != nil {
				log.Event(req.Context(), "error writing key to vault", log.Error(err))
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}
	}

	if len(uploadID) == 0 {

		createMultiInput := &s3.CreateMultipartUploadInput{
			Bucket:      &u.bucketName,
			Key:         &resum.Identifier,
			ContentType: &resum.Type,
		}

		createMultiOutput, err := u.client.CreateMultipartUpload(createMultiInput)
		if err != nil {
			log.Event(req.Context(), "error creating multipart upload", log.Error(err))
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

	if u.vaultClient != nil {
		pskStr, err := u.vaultClient.ReadKey(vaultPath, vaultKey)
		if err != nil {
			log.Event(req.Context(), "error reading key from vault", log.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		psk, err := hex.DecodeString(pskStr)
		if err != nil {
			log.Event(req.Context(), "error decoding key", log.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		_, err = u.client.UploadPartWithPSK(uploadPartInput, psk)
		if err != nil {
			log.Event(req.Context(), "error uploading with psk", log.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		_, err = u.client.UploadPart(uploadPartInput)
		if err != nil {
			log.Event(req.Context(), "error uploading part", log.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	log.Event(req.Context(), "chunk accepted", log.Data{
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
		log.Event(req.Context(), "error listing parts", log.Error(err))
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
		log.Event(req.Context(), "error marshalling json", log.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

func createPSK() []byte {
	key := make([]byte, 16)
	rand.Read(key)

	return key
}
