-- +goose Up
-- +goose StatementBegin
CREATE TABLE products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        JSONB NOT NULL DEFAULT '{}',
    description JSONB NOT NULL DEFAULT '{}',
    category    TEXT NOT NULL,
    price       NUMERIC(10, 2),
    in_stock    BOOLEAN NOT NULL DEFAULT true,
    image_url   TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_in_stock;
DROP TABLE IF EXISTS products;
-- +goose StatementEnd