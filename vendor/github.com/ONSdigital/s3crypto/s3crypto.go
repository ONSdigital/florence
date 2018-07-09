package s3crypto

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha1"
	"encoding/hex"
	"errors"
	"io"
	"io/ioutil"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

const encryptionKeyHeader = "Pskencrypted"

// ErrNoPrivateKey is returned when an attempt is made to access a method that requires a private key when it has not been provided
var ErrNoPrivateKey = errors.New("you have not provided a private key and therefore do not have permission to complete this action")

// ErrNoMetadataPSK is returned when the file you are trying to download is not encrypted
var ErrNoMetadataPSK = errors.New("no encrypted key found for this file, you are trying to download a file which is not encrypted")

// Config represents the configuration items for the
// CryptoClient
type Config struct {
	PublicKey  *rsa.PublicKey
	PrivateKey *rsa.PrivateKey

	HasUserDefinedPSK  bool
	MultipartChunkSize int
}

// CryptoClient provides a wrapper to the aws-sdk-go S3
// object
type CryptoClient struct {
	s3iface.S3API

	privKey           *rsa.PrivateKey
	publicKey         *rsa.PublicKey
	hasUserDefinedPSK bool
	chunkSize         int
}

// Uploader provides a wrapper to the aws-sdk-go s3manager uploader
// for encryption
type Uploader struct {
	*CryptoClient

	s3uploader *s3manager.Uploader
}

// New supports the creation of an Encryption supported client
// with a given aws session and rsa Private Key.
func New(sess *session.Session, cfg *Config) *CryptoClient {
	cc := &CryptoClient{s3.New(sess), cfg.PrivateKey, cfg.PublicKey, cfg.HasUserDefinedPSK, cfg.MultipartChunkSize}

	if cc.privKey != nil {
		cc.publicKey = &cc.privKey.PublicKey
	}

	return cc
}

// NewUploader creates a new instance of the s3crypto Uploader
func NewUploader(sess *session.Session, cfg *Config) *Uploader {
	cc := &CryptoClient{s3.New(sess), cfg.PrivateKey, cfg.PublicKey, cfg.HasUserDefinedPSK, cfg.MultipartChunkSize}

	if cc.privKey != nil {
		cc.publicKey = &cc.privKey.PublicKey
	}

	return &Uploader{
		CryptoClient: cc,

		s3uploader: s3manager.NewUploader(sess),
	}
}

// CreateMultipartUploadRequest wraps the SDK method by creating a PSK which
// is encrypted using the public key and stored as metadata against the completed
// object, as well as temporarily being stored as its own object while the Multipart
// upload is being updated.
func (c *CryptoClient) CreateMultipartUploadRequest(input *s3.CreateMultipartUploadInput) (req *request.Request, out *s3.CreateMultipartUploadOutput) {
	req = new(request.Request)
	if !c.hasUserDefinedPSK {
		psk := createPSK()

		ekStr, err := c.encryptKey(psk)
		if err != nil {
			req.Error = err
			return
		}

		input.Metadata = make(map[string]*string)
		input.Metadata[encryptionKeyHeader] = &ekStr

		if err := c.storeEncryptedKey(input, ekStr); err != nil {
			req.Error = err
			return
		}
	}

	return c.S3API.CreateMultipartUploadRequest(input)
}

// CreateMultipartUpload is a wrapper for CreateMultipartUploadRequest
func (c *CryptoClient) CreateMultipartUpload(input *s3.CreateMultipartUploadInput) (*s3.CreateMultipartUploadOutput, error) {
	req, out := c.CreateMultipartUploadRequest(input)
	return out, req.Send()
}

// CreateMultipartUploadWithContext is a wrapper for CreateMultipartUploadRequest with
// the additional context, and request options support.
func (c *CryptoClient) CreateMultipartUploadWithContext(ctx aws.Context, input *s3.CreateMultipartUploadInput, opts ...request.Option) (*s3.CreateMultipartUploadOutput, error) {
	req, out := c.CreateMultipartUploadRequest(input)
	req.SetContext(ctx)
	req.ApplyOptions(opts...)
	return out, req.Send()
}

// UploadPartRequest wraps the SDK method by retrieving the encrypted PSK from the temporary
// object, decrypting the PSK using the private key, before stream encoding the content
// for the particular part
func (c *CryptoClient) UploadPartRequest(input *s3.UploadPartInput) (req *request.Request, out *s3.UploadPartOutput) {
	req = new(request.Request)
	ekStr, err := c.getEncryptedKey(input)
	if err != nil {
		req.Error = err
		return
	}

	psk, err := c.decryptKey(ekStr)
	if err != nil {
		req.Error = err
		return
	}

	encryptedContent, err := encryptObjectContent(psk, input.Body)
	if err != nil {
		req.Error = err
		return
	}

	input.Body = bytes.NewReader(encryptedContent)

	return c.S3API.UploadPartRequest(input)
}

// UploadPartRequestWithPSK wraps the SDK method encrypting the part contents with a user defined
// PSK
func (c *CryptoClient) UploadPartRequestWithPSK(input *s3.UploadPartInput, psk []byte) (req *request.Request, out *s3.UploadPartOutput) {
	req = new(request.Request)
	encryptedContent, err := encryptObjectContent(psk, input.Body)
	if err != nil {
		req.Error = err
		return
	}

	input.Body = bytes.NewReader(encryptedContent)

	return c.S3API.UploadPartRequest(input)
}

// UploadPart is a wrapper for UploadPartRequest
func (c *CryptoClient) UploadPart(input *s3.UploadPartInput) (*s3.UploadPartOutput, error) {
	req, out := c.UploadPartRequest(input)
	return out, req.Send()
}

// UploadPartWithPSK is a wrapper for UploadPartRequestWithPSK
func (c *CryptoClient) UploadPartWithPSK(input *s3.UploadPartInput, psk []byte) (*s3.UploadPartOutput, error) {
	req, out := c.UploadPartRequestWithPSK(input, psk)
	return out, req.Send()
}

// UploadPartWithContext is a wrapper for UploadPartRequest with
// the additional context, and request options support.
func (c *CryptoClient) UploadPartWithContext(ctx aws.Context, input *s3.UploadPartInput, opts ...request.Option) (*s3.UploadPartOutput, error) {
	req, out := c.UploadPartRequest(input)
	req.SetContext(ctx)
	req.ApplyOptions(opts...)
	return out, req.Send()
}

// UploadPartWithContextWithPSK is a wrapper for UploadPartRequestWithPSK with
// the additional context, and request options support.
func (c *CryptoClient) UploadPartWithContextWithPSK(ctx aws.Context, input *s3.UploadPartInput, psk []byte, opts ...request.Option) (*s3.UploadPartOutput, error) {
	req, out := c.UploadPartRequestWithPSK(input, psk)
	req.SetContext(ctx)
	req.ApplyOptions(opts...)
	return out, req.Send()
}

// PutObjectRequest wraps the SDK method by creating a PSK, encrypting it using the public key,
// and encrypting the object content using the PSK
func (c *CryptoClient) PutObjectRequest(input *s3.PutObjectInput) (req *request.Request, out *s3.PutObjectOutput) {
	req = new(request.Request)
	psk := createPSK()

	ekStr, err := c.encryptKey(psk)
	if err != nil {
		req.Error = err
		return
	}

	input.Metadata = make(map[string]*string)
	input.Metadata[encryptionKeyHeader] = &ekStr

	encryptedContent, err := encryptObjectContent(psk, input.Body)
	if err != nil {
		req.Error = err
		return
	}

	input.Body = bytes.NewReader(encryptedContent)

	return c.S3API.PutObjectRequest(input)
}

// PutObjectRequestWithPSK wraps the SDK method by encrypting the object content with a user defined PSK
func (c *CryptoClient) PutObjectRequestWithPSK(input *s3.PutObjectInput, psk []byte) (req *request.Request, out *s3.PutObjectOutput) {
	req = new(request.Request)
	encryptedContent, err := encryptObjectContent(psk, input.Body)
	if err != nil {
		req.Error = err
		return
	}

	input.Body = bytes.NewReader(encryptedContent)

	return c.S3API.PutObjectRequest(input)
}

// PutObject is a wrapper for PutObjectRequest
func (c *CryptoClient) PutObject(input *s3.PutObjectInput) (*s3.PutObjectOutput, error) {
	req, out := c.PutObjectRequest(input)
	return out, req.Send()
}

// PutObjectWithPSK is a wrapper for PutObjectRequestWithPSK
func (c *CryptoClient) PutObjectWithPSK(input *s3.PutObjectInput, psk []byte) (*s3.PutObjectOutput, error) {
	req, out := c.PutObjectRequestWithPSK(input, psk)
	return out, req.Send()
}

// PutObjectWithContextWithPSK is a wrapper for PutObjectRequestWithPSK with
// the additional context, and request options support.
func (c *CryptoClient) PutObjectWithContextWithPSK(ctx aws.Context, input *s3.PutObjectInput, psk []byte, opts ...request.Option) (*s3.PutObjectOutput, error) {
	req, out := c.PutObjectRequestWithPSK(input, psk)
	req.SetContext(ctx)
	req.ApplyOptions(opts...)
	return out, req.Send()
}

// GetObjectRequest wraps the SDK method by retrieving the encrypted PSK from the object metadata.
// The PSK is then decrypted, and is then used to decrypt the content of the object.
func (c *CryptoClient) GetObjectRequest(input *s3.GetObjectInput) (req *request.Request, out *s3.GetObjectOutput) {
	req, out = c.S3API.GetObjectRequest(input)

	err := req.Send()
	if err != nil {
		req.Error = err
		return
	}

	ekStr := out.Metadata[encryptionKeyHeader]

	if ekStr == nil {
		req.Error = ErrNoMetadataPSK
		return
	}

	psk, err := c.decryptKey(*ekStr)
	if err != nil {
		req.Error = err
		return
	}

	var content []byte
	if c.chunkSize > 0 {
		content, err = decryptObjectContentChunks(c.chunkSize, psk, out.Body)
	} else {
		content, err = decryptObjectContent(psk, out.Body)
	}
	if err != nil {
		req.Error = err
		return
	}

	out.Body = ioutil.NopCloser(bytes.NewReader(content))

	return
}

// GetObjectRequestWithPSK wraps the SDK method by decrypting the retrieved object content with the given PSK
func (c *CryptoClient) GetObjectRequestWithPSK(input *s3.GetObjectInput, psk []byte) (req *request.Request, out *s3.GetObjectOutput) {
	req, out = c.S3API.GetObjectRequest(input)

	err := req.Send()
	if err != nil {
		req.Error = err
		return
	}

	var content []byte
	if c.chunkSize > 0 {
		content, err = decryptObjectContentChunks(c.chunkSize, psk, out.Body)
	} else {
		content, err = decryptObjectContent(psk, out.Body)
	}
	if err != nil {
		req.Error = err
		return
	}

	out.Body = ioutil.NopCloser(bytes.NewReader(content))

	return
}

// GetObject is a wrapper for GetObjectRequest
func (c *CryptoClient) GetObject(input *s3.GetObjectInput) (*s3.GetObjectOutput, error) {
	req, out := c.GetObjectRequest(input)
	return out, req.Error
}

// GetObjectWithPSK is a wrapper for GetObjectRequestWithPSK
func (c *CryptoClient) GetObjectWithPSK(input *s3.GetObjectInput, psk []byte) (*s3.GetObjectOutput, error) {
	req, out := c.GetObjectRequestWithPSK(input, psk)
	return out, req.Error
}

// GetObjectWithContext is a wrapper for GetObjectRequest with
// the additional context, and request options support.
func (c *CryptoClient) GetObjectWithContext(ctx aws.Context, input *s3.GetObjectInput, opts ...request.Option) (*s3.GetObjectOutput, error) {
	req, out := c.GetObjectRequest(input)
	req.SetContext(ctx)
	req.ApplyOptions(opts...)
	return out, req.Error
}

// GetObjectWithContextWithPSK is a wrapper for GetObjectRequestWithPSK with
// the additional context, and request options support.
func (c *CryptoClient) GetObjectWithContextWithPSK(ctx aws.Context, input *s3.GetObjectInput, psk []byte, opts ...request.Option) (*s3.GetObjectOutput, error) {
	req, out := c.GetObjectRequestWithPSK(input, psk)
	req.SetContext(ctx)
	req.ApplyOptions(opts...)
	return out, req.Error
}

// CompleteMultipartUploadRequest wraps the SDK method by removing the temporarily stored encrypted
// PSK object.
func (c *CryptoClient) CompleteMultipartUploadRequest(input *s3.CompleteMultipartUploadInput) (req *request.Request, out *s3.CompleteMultipartUploadOutput) {
	req = new(request.Request)
	if !c.hasUserDefinedPSK {
		if err := c.removeEncryptedKey(input); err != nil {
			req.Error = err
		}
	}

	return c.S3API.CompleteMultipartUploadRequest(input)
}

// CompleteMultipartUpload is a wrapper for CompleteMultipartUploadRequest
func (c *CryptoClient) CompleteMultipartUpload(input *s3.CompleteMultipartUploadInput) (*s3.CompleteMultipartUploadOutput, error) {
	req, out := c.CompleteMultipartUploadRequest(input)
	return out, req.Send()
}

// CompleteMultipartUploadWithContext is a wrapper for CompleteMultipartUploadRequest with
// the additional context, and request options support.
func (c *CryptoClient) CompleteMultipartUploadWithContext(ctx aws.Context, input *s3.CompleteMultipartUploadInput, opts ...request.Option) (*s3.CompleteMultipartUploadOutput, error) {
	req, out := c.CompleteMultipartUploadRequest(input)
	req.SetContext(ctx)
	req.ApplyOptions(opts...)
	return out, req.Send()
}

func (c *CryptoClient) storeEncryptedKey(input *s3.CreateMultipartUploadInput, key string) error {
	keyFileName := *input.Key + ".key"

	objectInput := &s3.PutObjectInput{
		Body:   aws.ReadSeekCloser(strings.NewReader(key)),
		Bucket: input.Bucket,
		Key:    &keyFileName,
	}

	_, err := c.S3API.PutObject(objectInput)
	return err
}

func (c *CryptoClient) getEncryptedKey(input *s3.UploadPartInput) (string, error) {
	keyFileName := *input.Key + ".key"

	objectInput := &s3.GetObjectInput{
		Bucket: input.Bucket,
		Key:    &keyFileName,
	}

	objectOutput, err := c.S3API.GetObject(objectInput)
	if err != nil {
		return "", err
	}

	key, err := ioutil.ReadAll(objectOutput.Body)
	if err != nil {
		return "", err
	}

	return string(key), nil
}

func (c *CryptoClient) removeEncryptedKey(input *s3.CompleteMultipartUploadInput) error {
	keyFileName := *input.Key + ".key"

	objectInput := &s3.DeleteObjectInput{
		Bucket: input.Bucket,
		Key:    &keyFileName,
	}

	_, err := c.S3API.DeleteObject(objectInput)
	return err
}

func (c *CryptoClient) encryptKey(psk []byte) (string, error) {
	hash := sha1.New()
	encryptedKey, err := rsa.EncryptOAEP(hash, rand.Reader, c.publicKey, psk, []byte(""))
	if err != nil {
		return "", err
	}

	ekStr := hex.EncodeToString(encryptedKey)
	return ekStr, nil
}

func (c *CryptoClient) decryptKey(encryptedKeyHex string) ([]byte, error) {
	if c.privKey == nil {
		return nil, ErrNoPrivateKey
	}

	encryptedKey, err := hex.DecodeString(encryptedKeyHex)
	if err != nil {
		return nil, err
	}

	hash := sha1.New()
	return rsa.DecryptOAEP(hash, rand.Reader, c.privKey, encryptedKey, []byte(""))
}

// Upload provides a wrapper for the sdk method with encryption
func (u *Uploader) Upload(input *s3manager.UploadInput) (output *s3manager.UploadOutput, err error) {
	psk := createPSK()

	ekStr, err := u.CryptoClient.encryptKey(psk)
	if err != nil {
		return
	}

	input.Metadata = make(map[string]*string)
	input.Metadata[encryptionKeyHeader] = &ekStr

	encryptedContent, err := encryptObjectContent(psk, input.Body)
	if err != nil {
		return
	}

	input.Body = bytes.NewReader(encryptedContent)

	return u.s3uploader.Upload(input)
}

// UploadWithPSK allows you to encrypt the file with a given psk
func (u *Uploader) UploadWithPSK(input *s3manager.UploadInput, psk []byte) (output *s3manager.UploadOutput, err error) {
	encryptedContent, err := encryptObjectContent(psk, input.Body)
	if err != nil {
		return
	}

	input.Body = bytes.NewReader(encryptedContent)

	return u.s3uploader.Upload(input)
}

func encryptObjectContent(psk []byte, b io.Reader) ([]byte, error) {
	unencryptedBytes, err := ioutil.ReadAll(b)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher(psk)
	if err != nil {
		return nil, err
	}

	encryptedBytes := make([]byte, len(unencryptedBytes))

	stream := cipher.NewCFBEncrypter(block, psk)

	stream.XORKeyStream(encryptedBytes, unencryptedBytes)

	return encryptedBytes, nil
}

func decryptObjectContentChunks(size int, psk []byte, r io.ReadCloser) ([]byte, error) {

	b, err := ioutil.ReadAll(r)
	if err != nil {
		return nil, err
	}

	var buf bytes.Buffer
	for chunkOffset := 0; chunkOffset < len(b); chunkOffset += size {
		chunkEnd := chunkOffset + size
		if chunkEnd > len(b) {
			chunkEnd = len(b)
		}

		unencryptedChunk, err := decryptObjectContent(psk, ioutil.NopCloser(bytes.NewReader(b[chunkOffset:chunkEnd])))
		if err != nil {
			return nil, err
		}

		_, err = buf.Write(unencryptedChunk)
		if err != nil {
			return nil, err
		}
	}

	return buf.Bytes(), nil
}

func decryptObjectContent(psk []byte, b io.ReadCloser) ([]byte, error) {
	encryptedBytes, err := ioutil.ReadAll(b)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher(psk)
	if err != nil {
		return nil, err
	}

	stream := cipher.NewCFBDecrypter(block, psk)

	unencryptedBytes := make([]byte, len(encryptedBytes))
	stream.XORKeyStream(unencryptedBytes, encryptedBytes)

	return unencryptedBytes, nil
}

func createPSK() []byte {
	key := make([]byte, 16)
	rand.Read(key)

	return key
}
