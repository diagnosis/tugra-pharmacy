package handlers

import (
	"github.com/diagnosis/tugra-pharmacy/internal/config"
	"github.com/diagnosis/tugra-pharmacy/internal/spaces"
	productstore "github.com/diagnosis/tugra-pharmacy/internal/store/product"
)

type ProductHandler struct {
	cfg          *config.Config
	productStore productstore.ProductStore
	spaceClient  *spaces.Client
}

func NewProductHandler(
	cfg *config.Config, productStore productstore.ProductStore, spaceClient *spaces.Client,
) *ProductHandler {
	return &ProductHandler{
		cfg:          cfg,
		productStore: productStore,
		spaceClient:  spaceClient,
	}
}
