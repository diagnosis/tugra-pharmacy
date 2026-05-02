-- +goose Up
-- +goose StatementBegin
ALTER TABLE products
    ADD CONSTRAINT valid_category
        CHECK (category IN (
                            'medications','vitamins','suncare','skincare','haircare',
                            'baby','firstaid','devices','dental','eyecare','natural','other'
            ));
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- +goose StatementEnd
