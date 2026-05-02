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

func (h *ProductHandler) HandleList(w http.ResponseWriter, r *http.Request) {
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
	if isFeaturedStr := r.URL.Query().Get("is_featured"); isFeaturedStr != "" {
		isFeatured, err := strconv.ParseBool(isFeaturedStr)
		if err != nil {
			responder.Error(w, errors.BadRequest("invalid is_featured value", "must be true or false", err), correlationID)
			return
		}
		filters.IsFeatured = &isFeatured
	}

	limit := 12
	offset := 0
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			if l > 100 {
				l = 100
			}
			limit = l
		}
	}
	if offsetStr := r.URL.Query().Get("offset"); offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
			offset = o
		}
	}
	filters.Limit = limit
	filters.Offset = offset

	result, err := h.productStore.List(ctx, filters)
	if err != nil {
		logger.Error(ctx, "failed to list products", "err", err)
		responder.Error(w, errors.Internal("failed to fetch products", "db error", err), correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"products": result.Products,
		"total":    result.Total,
		"limit":    limit,
		"offset":   offset,
	}, correlationID)
}

func (h *ProductHandler) HandleGetByID(w http.ResponseWriter, r *http.Request) {
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
