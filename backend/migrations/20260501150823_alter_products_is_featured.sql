-- +goose Up
-- +goose StatementBegin
ALTER TABLE products ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- +goose StatementEnd
