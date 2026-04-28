package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
)

type HealthHandler struct{}

func NewHealthHandler() *HealthHandler { return &HealthHandler{} }

func (h *HealthHandler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	responder.JSON(w, http.StatusOK, map[string]string{
		"server_status:": "ok",
	}, correlationID)
}
