package spaces

import (
	"context"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/diagnosis/tugra-pharmacy/internal/config"
)

type Client struct {
	s3Client   *s3.Client
	bucketName string
	cdnURL     string
}

func NewClient(cfg *config.Config) (*Client, error) {
	s3Client := s3.New(s3.Options{
		Region: cfg.Spaces.Region,
		Credentials: aws.NewCredentialsCache(
			credentials.NewStaticCredentialsProvider(
				cfg.Spaces.Key,
				cfg.Spaces.Secret,
				"",
			),
		),
		BaseEndpoint: aws.String(
			fmt.Sprintf("https://%s.digitaloceanspaces.com", cfg.Spaces.Region),
		),
	})
	return &Client{
		s3Client:   s3Client,
		bucketName: cfg.Spaces.Bucket,
		cdnURL:     cfg.Spaces.CDNUrl,
	}, nil
}

func (c *Client) UploadImage(
	ctx context.Context,
	key string,
	data io.Reader,
	contentType string,
) (string, error) {
	_, err := c.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(c.bucketName),
		Key:         aws.String(key),
		Body:        data,
		ContentType: aws.String(contentType),
		ACL:         types.ObjectCannedACLPublicRead,
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload image: %w", err)
	}
	// return CDN URL
	return fmt.Sprintf("%s/%s", c.cdnURL, key), nil
}

func (c *Client) DeleteImage(ctx context.Context, key string) error {
	_, err := c.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(c.bucketName),
		Key:    aws.String(key),
	})
	if err != nil {
		return fmt.Errorf("failed to delete image: %w", err)
	}
	return nil
}
