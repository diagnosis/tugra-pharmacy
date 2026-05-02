package handlers

import (
	"context"
	"net/http"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/middleware"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/google/uuid"
)

func (h *AuthHandler) HandleMe(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	correlationID, _ := logger.GetCorrelationID(ctx)
	idStr, ok := middleware.GetUserID(ctx)
	if !ok {
		logger.Error(ctx, "unauthorized")
		responder.Error(w, errors.Unauthorized("authentication required", "no user in context"), correlationID)
		return
	}
	id, err := uuid.Parse(idStr)
	if err != nil {
		logger.Error(ctx, "invalid id", "err", err)
		responder.Error(w, errors.BadRequest("invalid user identifier", "uuid parse error"), correlationID)
		return
	}

	// fetch user
	admin, err := h.adminStore.GetByID(ctx, id)
	if err != nil {
		logger.Error(ctx, "failed to retrieve user", "user_id", id, "err", err)
		responder.Error(w, err, correlationID)
		return
	}
	response := map[string]any{
		"id": admin.ID,
		"email": admin.Email,
		"created_at":admin.CreatedAt,
	}

	responder.JSON(w, 200, response, correlationID)
}
