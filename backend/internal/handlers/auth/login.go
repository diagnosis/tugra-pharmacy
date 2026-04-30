package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/secure"
	"github.com/diagnosis/go-toolkit/validator"
	"github.com/diagnosis/tugra-pharmacy/internal/helper"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	fieldValidator := validator.New()
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	var req LoginRequest
	if err := helper.ParseReq(r, &req); err != nil {
		logger.Error(ctx, "failed to parse login request", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	fieldValidator.Email("Email", req.Email)
	fieldValidator.Required("password", req.Password)
	if verr := fieldValidator.Errors(); verr != nil {
		responder.Error(w, verr, correlationID)
		return
	}

	admin, err := h.adminStore.GetByEmail(ctx, req.Email)
	if err != nil {
		logger.Error(ctx, "user lookup failed", "err", err)
		responder.Error(w, errors.InvalidCredentials("invalid email or password", "user not found", err), correlationID)
		return
	}

	//verify password
	match, err := secure.VerifyPassword(req.Password, admin.PasswordHash)
	if err != nil {
		logger.Error(ctx, "password verification error", "err", err)
		responder.Error(w, errors.Internal("internal error", "internal error"), correlationID)
		return
	}
	if !match {
		logger.Error(ctx, "user forbidden/ wrong creds", "err", err)
		responder.Error(w, errors.InvalidCredentials("invalid email or password", "user not found", err), correlationID)
		return
	}

	accessToken, err := h.adminJWT.SignAccess(admin.ID.String())
	if err != nil {
		logger.Error(ctx, "failed to sign access tokens", "err", err)
		responder.Error(w, errors.Internal("authentication failed", "token signing error", err), correlationID)
		return
	}

	refreshToken, err := h.adminJWT.SignRefresh(admin.ID.String())
	if err != nil {
		logger.Error(ctx, "failed to sign refresh tokens", "err", err)
		responder.Error(w, errors.Internal("authentication failed", "token signing error", err), correlationID)
		return
	}

	err = h.refreshTokenStore.DeleteAllByAdminID(ctx, admin.ID)
	if err != nil {
		logger.Warn(ctx, "failed to delete old refresh token", "err", err)
	}

	err = h.refreshTokenStore.Create(
		ctx,
		admin.ID,
		secure.HashRefreshToken(refreshToken),
		time.Now().UTC().Add(h.adminJWT.RefreshExpiry()),
	)

	if err != nil {
		logger.Error(ctx, "failed to create refresh token", "err", err)
		responder.Error(w, errors.Internal("authentication failed", "failed to create refresh token", err), correlationID)
		return
	}

	h.setRefreshTokenCookie(w, refreshToken)
	//response
	response := map[string]any{
		"access_token": accessToken,
		"token_type":   "Bearer",
		"expires_in":   int(h.adminJWT.AccessExpiry().Seconds()),
		"user": map[string]any{
			"id":    admin.ID,
			"email": admin.Email,
		},
	}
	responder.JSON(w, 200, response, correlationID)

}

func (h *AuthHandler) setRefreshTokenCookie(w http.ResponseWriter, token string) {
	// Production: Strict security with HTTPS
	sameSite := http.SameSiteStrictMode
	scr := true

	if h.cfg.App.Env == "dev" {
		// Dev: Relaxed for localhost cross-origin
		sameSite = http.SameSiteLaxMode
		scr = false
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Path:     "/",
		MaxAge:   int(h.adminJWT.RefreshExpiry().Seconds()),
		HttpOnly: true,
		Secure:   scr,
		SameSite: sameSite,
	})
}
