package store

import (
	"context"
	"errors"
	errors2 "github.com/diagnosis/go-toolkit/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Admin struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
}

type AdminStore interface {
	GetByID(ctx context.Context, id uuid.UUID) (*Admin, error)
	GetByEmail(ctx context.Context, email string) (*Admin, error)
}

type AdminPGStore struct {
	pool *pgxpool.Pool
}

func NewAdminPGStore(pool *pgxpool.Pool) *AdminPGStore {
	return &AdminPGStore{pool: pool}
}

func (s *AdminPGStore) GetByEmail(ctx context.Context, email string) (*Admin, error) {
	q := `SELECT id, email, password_hash, created_at
	      FROM admins
	      WHERE email = $1`

	var admin Admin

	err := s.pool.QueryRow(ctx, q, email).Scan(
		&admin.ID,
		&admin.Email,
		&admin.PasswordHash,
		&admin.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors2.NotFound("user not found", "user not found", err)
		}
		return nil, err
	}

	return &admin, nil
}
func (s *AdminPGStore) GetByID(ctx context.Context, id uuid.UUID) (*Admin, error) {
	q := `SELECT id, email, password_hash, created_at
	      FROM admins
	      WHERE id = $1`

	var admin Admin

	err := s.pool.QueryRow(ctx, q, id).Scan(
		&admin.ID,
		&admin.Email,
		&admin.PasswordHash,
		&admin.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors2.NotFound("user not found", "user not found", err)
		}
		return nil, err
	}

	return &admin, nil
}
