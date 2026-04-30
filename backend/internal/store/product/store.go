package store

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	errors2 "github.com/diagnosis/go-toolkit/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Product struct {
	ID          uuid.UUID         `json:"id"`
	Name        map[string]string `json:"name"`
	Description map[string]string `json:"description"`
	Category    string            `json:"category"`
	Price       *float64          `json:"price"`
	InStock     bool              `json:"in_stock"`
	ImageURL    string            `json:"image_url"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
}

type ProductFilters struct {
	Category *string
	InStock  *bool
	Search   *string
}

type ProductStore interface {
	GetByID(ctx context.Context, id uuid.UUID) (*Product, error)
	List(ctx context.Context, filters ProductFilters) ([]*Product, error)
	Create(ctx context.Context, p *Product) (*Product, error)
	Update(ctx context.Context, id uuid.UUID, p *Product) (*Product, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type ProductPGStore struct {
	pool *pgxpool.Pool
}

func NewProductPGStore(pool *pgxpool.Pool) *ProductPGStore {
	return &ProductPGStore{pool: pool}
}

func (s *ProductPGStore) GetByID(ctx context.Context, id uuid.UUID) (*Product, error) {
	q := `
		SELECT id, name, description, category, price, in_stock, image_url, created_at, updated_at
		FROM products
		WHERE id = $1
	`
	row := s.pool.QueryRow(ctx, q, id)
	p, err := scanProduct(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors2.NotFound("product not found", "product not found", err)
		}
		return nil, err
	}
	return p, nil
}

func (s *ProductPGStore) List(ctx context.Context, filters ProductFilters) ([]*Product, error) {
	q := `
		SELECT id, name, description, category, price, in_stock, image_url, created_at, updated_at
		FROM products
		WHERE 1=1
	`
	args := []any{}
	i := 1

	if filters.Category != nil {
		q += fmt.Sprintf(" AND category = $%d", i)
		args = append(args, *filters.Category)
		i++
	}

	if filters.InStock != nil {
		q += fmt.Sprintf(" AND in_stock = $%d", i)
		args = append(args, *filters.InStock)
		i++
	}

	if filters.Search != nil {
		// search across all 4 language values in the JSONB column
		q += fmt.Sprintf(" AND name::text ILIKE $%d", i)
		args = append(args, "%"+*filters.Search+"%")
		i++
	}

	q += " ORDER BY created_at DESC"

	rows, err := s.pool.Query(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*Product
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return products, nil
}

func (s *ProductPGStore) Create(ctx context.Context, p *Product) (*Product, error) {
	q := `
		INSERT INTO products (name, description, category, price, in_stock, image_url)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, name, description, category, price, in_stock, image_url, created_at, updated_at
	`
	nameJSON, err := json.Marshal(p.Name)
	if err != nil {
		return nil, err
	}
	descJSON, err := json.Marshal(p.Description)
	if err != nil {
		return nil, err
	}

	row := s.pool.QueryRow(ctx, q, nameJSON, descJSON, p.Category, p.Price, p.InStock, p.ImageURL)
	created, err := scanProduct(row)
	if err != nil {
		return nil, err
	}
	return created, nil
}

func (s *ProductPGStore) Update(ctx context.Context, id uuid.UUID, p *Product) (*Product, error) {
	q := `
		UPDATE products
		SET name        = $1,
		    description = $2,
		    category    = $3,
		    price       = $4,
		    in_stock    = $5,
		    image_url   = $6,
		    updated_at  = now()
		WHERE id = $7
		RETURNING id, name, description, category, price, in_stock, image_url, created_at, updated_at
	`
	nameJSON, err := json.Marshal(p.Name)
	if err != nil {
		return nil, err
	}
	descJSON, err := json.Marshal(p.Description)
	if err != nil {
		return nil, err
	}

	row := s.pool.QueryRow(ctx, q, nameJSON, descJSON, p.Category, p.Price, p.InStock, p.ImageURL, id)
	updated, err := scanProduct(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors2.NotFound("product not found", "product not found", err)
		}
		return nil, err
	}
	return updated, nil
}

func (s *ProductPGStore) Delete(ctx context.Context, id uuid.UUID) error {
	q := `DELETE FROM products WHERE id = $1`
	result, err := s.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return errors2.NotFound("product not found", "product not found")
	}
	return nil
}

func scanProduct(row pgx.Row) (*Product, error) {
	var p Product
	var nameJSON, descJSON []byte

	err := row.Scan(
		&p.ID,
		&nameJSON,
		&descJSON,
		&p.Category,
		&p.Price,
		&p.InStock,
		&p.ImageURL,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(nameJSON, &p.Name); err != nil {
		return nil, err
	}
	if err := json.Unmarshal(descJSON, &p.Description); err != nil {
		return nil, err
	}

	return &p, nil
}
