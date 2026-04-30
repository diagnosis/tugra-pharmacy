package store

import (
	"context"
	"errors"
	"time"

	errors2 "github.com/diagnosis/go-toolkit/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RefreshToken struct {
	ID        uuid.UUID
	AdminID   uuid.UUID
	TokenHash string
	ExpiresAt time.Time
	CreatedAt time.Time
}

type RefreshTokenStore interface {
	Create(ctx context.Context, adminID uuid.UUID, tokenHash string, expiresAt time.Time) error
	GetByHash(ctx context.Context, tokenHash string) (*RefreshToken, error)
	DeleteByHash(ctx context.Context, tokenHash string) error
	DeleteAllByAdminID(ctx context.Context, adminID uuid.UUID) error
}

type RefreshTokenPGStore struct {
	pool *pgxpool.Pool
}

func NewRefreshTokenPGStore(pool *pgxpool.Pool) *RefreshTokenPGStore {
	return &RefreshTokenPGStore{pool: pool}
}

func (s *RefreshTokenPGStore) Create(
	ctx context.Context,
	adminID uuid.UUID,
	tokenHash string,
	expiresAt time.Time,
) error {
	q := `
	INSERT INTO admin_refresh_tokens
	    (admin_id, token_hash, expires_at)
	VALUES
	    ($1, $2, $3)
	`
	_, err := s.pool.Exec(ctx, q, adminID, tokenHash, expiresAt)
	return err
}

func (s *RefreshTokenPGStore) GetByHash(ctx context.Context, tokenHash string) (*RefreshToken, error) {
	q := `
	SELECT id, admin_id, token_hash, expires_at, created_at
	FROM admin_refresh_tokens
	WHERE token_hash = $1
	  AND expires_at > now()
	`

	token, err := scanRefreshToken(s.pool.QueryRow(ctx, q, tokenHash))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors2.NotFound("refresh token not found", "refresh token not found", err)
		}
		return nil, err
	}

	return token, nil
}

func (s *RefreshTokenPGStore) DeleteByHash(ctx context.Context, tokenHash string) error {
	q := `DELETE FROM admin_refresh_tokens WHERE token_hash = $1`
	_, err := s.pool.Exec(ctx, q, tokenHash)
	return err
}

func (s *RefreshTokenPGStore) DeleteAllByAdminID(
	ctx context.Context,
	adminID uuid.UUID,
) error {
	q := `DELETE FROM admin_refresh_tokens WHERE admin_id = $1`
	_, err := s.pool.Exec(ctx, q, adminID)
	return err
}

func scanRefreshToken(row pgx.Row) (*RefreshToken, error) {
	var t RefreshToken

	err := row.Scan(
		&t.ID,
		&t.AdminID,
		&t.TokenHash,
		&t.ExpiresAt,
		&t.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &t, nil
}
