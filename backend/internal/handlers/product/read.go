package handlers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	productstore "github.com/diagnosis/tugra-pharmacy/internal/store/product"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (h *ProductHandler) List(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	filters := productstore.ProductFilters{}

	if category := r.URL.Query().Get("category"); category != "" {
		filters.Category = &category
	}

	if search := r.URL.Query().Get("search"); search != "" {
		filters.Search = &search
	}

	if inStockStr := r.URL.Query().Get("in_stock"); inStockStr != "" {
		inStock, err := strconv.ParseBool(inStockStr)
		if err != nil {
			responder.Error(w, errors.BadRequest("invalid in_stock value", "must be true or false", err), correlationID)
			return
		}
		filters.InStock = &inStock
	}

	products, err := h.productStore.List(ctx, filters)
	if err != nil {
		logger.Error(ctx, "failed to list products", "err", err)
		responder.Error(w, errors.Internal("failed to fetch products", "db error", err), correlationID)
		return
	}

	// return empty array instead of null
	if products == nil {
		products = []*productstore.Product{}
	}

	responder.JSON(w, http.StatusOK, products, correlationID)
}

func (h *ProductHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		responder.Error(w, errors.BadRequest("invalid product id", "uuid parse failed", err), correlationID)
		return
	}

	product, err := h.productStore.GetByID(ctx, productID)
	if err != nil {
		logger.Error(ctx, "failed to get product", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, product, correlationID)
}
