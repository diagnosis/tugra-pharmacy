package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/secure"
	"github.com/google/uuid"
)

func (h *AuthHandler) HandleRefresh(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	// 1. read cookie
	c, err := r.Cookie("refresh_token")
	if err != nil {
		logger.Error(ctx, "no refresh token cookie", "err", err)
		responder.Error(w, errors.Unauthorized("unauthorized", "missing refresh token cookie"), correlationID)
		return
	}

	// 2. verify JWT signature and get claims
	claims, err := h.adminJWT.VerifyRefresh(c.Value)
	if err != nil {
		logger.Error(ctx, "invalid refresh token", "err", err)
		responder.Error(w, errors.Unauthorized("unauthorized", "invalid refresh token"), correlationID)
		return
	}

	// 3. look up hashed token in DB (also checks expiry via query)
	_, err = h.refreshTokenStore.GetByHash(ctx, secure.HashRefreshToken(c.Value))
	if err != nil {
		logger.Error(ctx, "refresh token not found or expired", "err", err)
		responder.Error(w, errors.Unauthorized("unauthorized", "refresh token not found or expired"), correlationID)
		return
	}

	// 4. parse admin ID from claims
	adminID, err := uuid.Parse(claims.Sub)
	if err != nil {
		logger.Error(ctx, "failed to parse admin id from claims", "err", err)
		responder.Error(w, errors.Internal("internal error", "invalid subject claim", err), correlationID)
		return
	}

	// 5. fetch admin
	admin, err := h.adminStore.GetByID(ctx, adminID)
	if err != nil {
		logger.Error(ctx, "failed to fetch admin", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	// 6. rotate — delete all old tokens, issue new ones
	if err := h.refreshTokenStore.DeleteAllByAdminID(ctx, adminID); err != nil {
		logger.Warn(ctx, "failed to delete old refresh tokens", "err", err)
	}

	accessToken, err := h.adminJWT.SignAccess(adminID.String())
	if err != nil {
		logger.Error(ctx, "failed to sign access token", "err", err)
		responder.Error(w, errors.Internal("authentication failed", "token signing error", err), correlationID)
		return
	}

	newRefreshToken, err := h.adminJWT.SignRefresh(adminID.String())
	if err != nil {
		logger.Error(ctx, "failed to sign refresh token", "err", err)
		responder.Error(w, errors.Internal("authentication failed", "token signing error", err), correlationID)
		return
	}

	if err := h.refreshTokenStore.Create(
		ctx,
		adminID,
		secure.HashRefreshToken(newRefreshToken),
		time.Now().UTC().Add(h.adminJWT.RefreshExpiry()),
	); err != nil {
		logger.Error(ctx, "failed to store refresh token", "err", err)
		responder.Error(w, errors.Internal("authentication failed", "failed to store refresh token", err), correlationID)
		return
	}

	// 7. set new cookie and respond
	h.setRefreshTokenCookie(w, newRefreshToken)
	responder.JSON(w, http.StatusOK, map[string]any{
		"access_token": accessToken,
		"token_type":   "Bearer",
		"expires_in":   int(h.adminJWT.AccessExpiry().Seconds()),
		"user": map[string]any{
			"id":    admin.ID,
			"email": admin.Email,
		},
	}, correlationID)
}
