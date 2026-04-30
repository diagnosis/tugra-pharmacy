-- +goose Up
-- +goose StatementBegin
CREATE TABLE admin_refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id   UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_refresh_tokens_admin_id
    ON admin_refresh_tokens(admin_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_admin_refresh_tokens_admin_id;
DROP TABLE IF EXISTS admin_refresh_tokens;
-- +goose StatementEnd