package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/validator"
	productstore "github.com/diagnosis/tugra-pharmacy/internal/store/product"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ProductReq struct {
	Name        map[string]string `json:"name"`
	Description map[string]string `json:"description"`
	Category    string            `json:"category"`
	Price       *float64          `json:"price,omitempty"`
	InStock     bool              `json:"in_stock"`
}

func (h *ProductHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		logger.Error(ctx, "failed to parse request", "err", err)
		responder.Error(w, errors.BadRequest("invalid form", "multipart parse failed", err), correlationID)
		return
	}

	var req ProductReq
	if err := json.Unmarshal([]byte(r.FormValue("data")), &req); err != nil {
		responder.Error(w, errors.BadRequest("invalid product data", "json parse failed", err), correlationID)
		return
	}

	v := validator.New()
	v.Required("category", req.Category)
	v.Required("name.en", req.Name["en"])
	v.Required("name.tr", req.Name["tr"])
	v.Required("name.ru", req.Name["ru"])
	v.Required("name.de", req.Name["de"])
	v.Required("description.en", req.Description["en"])
	v.Required("description.tr", req.Description["tr"])
	v.Required("description.ru", req.Description["ru"])
	v.Required("description.de", req.Description["de"])
	if verr := v.Errors(); verr != nil {
		responder.Error(w, verr, correlationID)
		return
	}

	// image upload — optional
	imageURL := ""
	file, header, err := r.FormFile("image")
	if err == nil {
		defer func() {
			if err := file.Close(); err != nil {
				logger.Warn(ctx, "failed to close image file", "err", err)
			}
		}()
		contentType := header.Header.Get("Content-Type")
		key := fmt.Sprintf("products/%s-%s", uuid.New().String(), header.Filename)
		imageURL, err = h.spaceClient.UploadImage(ctx, key, file, contentType)
		if err != nil {
			logger.Error(ctx, "failed to upload image to spaces", "err", err)
			responder.Error(w, errors.Internal("upload failed", "spaces upload error", err), correlationID)
			return
		}
	}

	// save to DB — always runs regardless of image
	product, err := h.productStore.Create(ctx, &productstore.Product{
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		Price:       req.Price,
		InStock:     req.InStock,
		ImageURL:    imageURL,
	})
	if err != nil {
		logger.Error(ctx, "failed to create product", "err", err)
		responder.Error(w, errors.Internal("failed to create product", "db error", err), correlationID)
		return
	}

	responder.JSON(w, http.StatusCreated, product, correlationID)
}

func (h *ProductHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	correlationID, _ := logger.GetCorrelationID(ctx)

	//1. get product ID from URL
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		responder.Error(w, errors.BadRequest("invalid product id", "uuid parse failed", err), correlationID)
		return
	}

	// 2. parse multipart
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		logger.Error(ctx, "failed to parse request", "err", err)
		responder.Error(w, errors.BadRequest("invalid form", "multipart parse failed", err), correlationID)
		return
	}

	// 3. parse product JSON from "data" field
	var req ProductReq
	if err := json.Unmarshal([]byte(r.FormValue("data")), &req); err != nil {
		responder.Error(w, errors.BadRequest("invalid product data", "json parse failed", err), correlationID)
		return
	}

	// 4. validate
	v := validator.New()
	v.Required("category", req.Category)
	v.Required("name.en", req.Name["en"])
	v.Required("name.tr", req.Name["tr"])
	v.Required("name.ru", req.Name["ru"])
	v.Required("name.de", req.Name["de"])
	v.Required("description.en", req.Description["en"])
	v.Required("description.tr", req.Description["tr"])
	v.Required("description.ru", req.Description["ru"])
	v.Required("description.de", req.Description["de"])
	if verr := v.Errors(); verr != nil {
		responder.Error(w, verr, correlationID)
		return
	}

	// 5. get existing product to check for old image
	existing, err := h.productStore.GetByID(ctx, productID)
	if err != nil {
		logger.Error(ctx, "product not found", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	// 6. handle new image upload (optional)
	imageURL := existing.ImageURL // keep existing by default
	file, header, err := r.FormFile("image")
	if err == nil {
		defer func() {
			if err := file.Close(); err != nil {
				logger.Warn(ctx, "failed to close image file", "err", err)
			}
		}()

		//upload new image
		contentType := header.Header.Get("Content-type")
		key := fmt.Sprintf("products/%s-%s", uuid.New().String(), header.Filename)
		imageURL, err = h.spaceClient.UploadImage(ctx, key, file, contentType)
		if err != nil {
			logger.Error(ctx, "failed to upload image to spaces", "err", err)
			responder.Error(w, errors.Internal("upload failed", "spaces upload error", err), correlationID)
			return
		}

		// delete old image from spaces if it existed
		if existing.ImageURL != "" {
			oldKey := extractKey(existing.ImageURL, h.cfg.Spaces.CDNUrl)
			if err := h.spaceClient.DeleteImage(ctx, oldKey); err != nil {
				logger.Warn(ctx, "failed to delete old image from spaces", "err", err)
			}
		}
	}

	// 7. save to db
	product, err := h.productStore.Update(ctx, productID, &productstore.Product{
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		Price:       req.Price,
		InStock:     req.InStock,
		ImageURL:    imageURL,
	})

	if err != nil {
		logger.Error(ctx, "failed to update product", "err", err)
		responder.Error(w, errors.Internal("failed to update product", "db error", err), correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, product, correlationID)

}
func (h *ProductHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	// 1. get product ID from URL
	productID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		responder.Error(w, errors.BadRequest("invalid product id", "uuid parse failed", err), correlationID)
		return
	}

	// 2. get existing product to grab image key
	existing, err := h.productStore.GetByID(ctx, productID)
	if err != nil {
		logger.Error(ctx, "product not found", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	// 3. delete image from spaces first
	if existing.ImageURL != "" {
		oldKey := extractKey(existing.ImageURL, h.cfg.Spaces.CDNUrl)
		if err := h.spaceClient.DeleteImage(ctx, oldKey); err != nil {
			logger.Warn(ctx, "failed to delete image from spaces", "err", err)
			// non-fatal — continue to DB delete
		}
	}

	// 4. delete from DB
	if err := h.productStore.Delete(ctx, productID); err != nil {
		logger.Error(ctx, "failed to delete product", "err", err)
		responder.Error(w, errors.Internal("failed to delete product", "db error", err), correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, map[string]string{"status": "deleted"}, correlationID)
}

// extractKey strips the CDN base URL to get the Spaces object key
func extractKey(imageURL, cdnBase string) string {
	return strings.TrimPrefix(imageURL, cdnBase+"/")
}
