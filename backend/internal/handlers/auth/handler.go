package handlers

import (
	"github.com/diagnosis/go-toolkit/secure"
	"github.com/diagnosis/tugra-pharmacy/internal/config"
	adminstore "github.com/diagnosis/tugra-pharmacy/internal/store/admin"
	refreshtokenstore "github.com/diagnosis/tugra-pharmacy/internal/store/refreshtokenstore"
)

type AuthHandler struct {
	cfg               *config.Config
	adminJWT          *secure.JWTSigner
	adminStore        adminstore.AdminStore
	refreshTokenStore refreshtokenstore.RefreshTokenStore
}

func NewAuthHandler(
	cfg *config.Config,
	adminJWT *secure.JWTSigner,
	adminStore adminstore.AdminStore,
	refreshTokenStore refreshtokenstore.RefreshTokenStore,
) *AuthHandler {
	return &AuthHandler{
		cfg:               cfg,
		adminStore:        adminStore,
		adminJWT:          adminJWT,
		refreshTokenStore: refreshTokenStore,
	}
}
