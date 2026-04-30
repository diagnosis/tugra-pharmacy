package handlers

import (
	"context"
	"net/http"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/secure"
)

func (h *AuthHandler) HandleLogout(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()
	correlationID, _ := logger.GetCorrelationID(ctx)

	c, err := r.Cookie("refresh_token")
	if err != nil {
		// no cookie — already logged out, just return 200
		responder.JSON(w, http.StatusOK, map[string]string{"status": "logged out"}, correlationID)
		return
	}

	if err := h.refreshTokenStore.DeleteByHash(ctx, secure.HashRefreshToken(c.Value)); err != nil {
		logger.Warn(ctx, "failed to delete refresh token on logout", "err", err)
		// non-fatal — clear cookie anyway
	}

	h.clearRefreshTokenCookie(w)
	responder.JSON(w, http.StatusOK, map[string]string{"status": "logged out"}, correlationID)
}

func (h *AuthHandler) clearRefreshTokenCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   h.cfg.App.Env != "dev",
		SameSite: http.SameSiteStrictMode,
	})
}
