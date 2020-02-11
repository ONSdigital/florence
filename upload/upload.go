package upload

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/ONSdigital/dp-healthcheck/healthcheck"
	s3client "github.com/ONSdigital/dp-s3"
	"github.com/ONSdigital/log.go/log"
	"github.com/gorilla/schema"
)

//go:generate moq -out ./mock/mock_s3.go -pkg mock . S3Client
//go:generate moq -out ./mock/mock_vault.go -pkg mock . VaultClient

// AWSRegion is the Amazon Web Services Region that will be used.
const AWSRegion = "eu-west-1"

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

// s3Request creates a S3 UploadRequest struct from a Resumable struct
func (resum *Resumable) s3Request() *s3client.UploadRequest {
	return &s3client.UploadRequest{
		UploadKey:   resum.Identifier,
		Type:        resum.Type,
		ChunkNumber: resum.ChunkNumber,
		TotalChunks: resum.TotalChunks,
		FileName:    resum.FileName,
	}
}

// S3Client is an interface to represent methods called to action upon S3 (implemented by dp-s3)
type S3Client interface {
	Upload(ctx context.Context, req *s3client.UploadRequest, payload []byte) error
	UploadWithPsk(ctx context.Context, req *s3client.UploadRequest, payload []byte, psk []byte) error
	CheckUploaded(ctx context.Context, req *s3client.UploadRequest) (bool, error)
	GetPathStyleURL(path string) string
}

// VaultClient is an interface to represent methods called to action upon vault (implemented by dp-vault)
type VaultClient interface {
	ReadKey(path, key string) (string, error)
	WriteKey(path, key, value string) error
	Checker(ctx context.Context, state *healthcheck.CheckState) error
}

// Uploader represents the necessary configuration for uploading a file
type Uploader struct {
	client      S3Client
	vaultClient VaultClient

	bucketName string
	vaultPath  string
}

// New creates a new instance of Uploader using provided s3
// environment authentication
func New(bucketName, vaultPath string, vc VaultClient) (*Uploader, error) {

	// Determine if we are using Vault or not
	usingVault := vc != nil

	// Create S3 Client with region and bucket name.
	s3, err := s3client.New(AWSRegion, bucketName, usingVault)
	if err != nil {
		return nil, err
	}

	// Create Uploader with newly created S3 client, and Vault client (if provided)
	return Instantiate(s3, vc, bucketName, vaultPath), nil
}

// Instantiate returns a new Uploader from the provided clients and vars
func Instantiate(s3 S3Client, vc VaultClient, bucketName, vaultPath string) *Uploader {
	return &Uploader{s3, vc, bucketName, vaultPath}
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

	ok, err := u.client.CheckUploaded(req.Context(), resum.s3Request())
	if err != nil {
		w.WriteHeader(statusCodeFromError(err))
		return
	}

	if ok {
		log.Event(req.Context(), "uploaded file successfully", log.Data{"file-name": resum.FileName, "uid": resum.Identifier, "size": resum.TotalSize})
		w.WriteHeader(http.StatusOK)
		return
	}

	log.Event(req.Context(), "chunk number failed to upload", log.Data{"chunk_number": resum.ChunkNumber, "file_name": resum.FileName})
	w.WriteHeader(http.StatusNotFound)
}

// Upload handles the uploading of a file to AWS s3
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

	payload, err := ioutil.ReadAll(content)
	if err != nil {
		log.Event(req.Context(), "error reading file", log.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if u.vaultClient == nil {
		// Perform upload without PSK
		if err := u.client.Upload(req.Context(), resum.s3Request(), payload); err != nil {
			w.WriteHeader(statusCodeFromError(err))
			return
		}
		w.WriteHeader(http.StatusOK)
		return
	}

	vaultKey := "key"
	vaultPath := u.vaultPath + "/" + resum.Identifier

	// Get PSK from Vault. If the vault PSK is not found for this file, then create one and use it
	var psk []byte
	pskStr, err := u.vaultClient.ReadKey(vaultPath, vaultKey)
	if err != nil {
		// Create PSK and write it to Vault
		psk = createPSK()
		if err := u.vaultClient.WriteKey(vaultPath, vaultKey, hex.EncodeToString(psk)); err != nil {
			log.Event(req.Context(), "error writing key to vault", log.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		// Use existing PSK found in Vault
		psk, err = hex.DecodeString(pskStr)
		if err != nil {
			log.Event(req.Context(), "error decoding key", log.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	// Perform upload using vault PSK
	if err = u.client.UploadWithPsk(req.Context(), resum.s3Request(), payload, psk); err != nil {
		w.WriteHeader(statusCodeFromError(err))
		return
	}
	w.WriteHeader(http.StatusOK)
	return
}

// handleError decides the HTTP status according to the provided error
func statusCodeFromError(err error) int {
	switch err.(type) {
	case *s3client.ErrNotUploaded:
		return http.StatusNotFound
	case *s3client.ErrListParts:
		return http.StatusNotFound
	case *s3client.ErrChunkNumberNotFound:
		return http.StatusNotFound
	default:
		return http.StatusInternalServerError
	}
	// TODO I would suggest considering S3 client errors to be '502 BAD gateway'
}

// GetS3URL returns an S3 URL for a requested path, and the client's region and bucket name.
// Path corresponds to the S3 object key
func (u *Uploader) GetS3URL(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":id")

	url := u.client.GetPathStyleURL(path)

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
