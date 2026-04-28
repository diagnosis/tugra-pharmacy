package application

import (
	"context"
	"fmt"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/secure"
	"github.com/diagnosis/tugra-pharmacy/internal/config"
	"github.com/diagnosis/tugra-pharmacy/internal/database"
	authhandlers "github.com/diagnosis/tugra-pharmacy/internal/handlers/auth"
	healthhandlers "github.com/diagnosis/tugra-pharmacy/internal/handlers/health"
	adminstore "github.com/diagnosis/tugra-pharmacy/internal/store/admin"
)

type Application struct {
	//jwtSigner
	adminJWT *secure.JWTSigner
	//stores
	adminStore adminstore.AdminStore

	//handlers
	healthHandler *healthhandlers.HealthHandler
	authHandler   *authhandlers.AuthHandler
}

func NewApplication() (*Application, error) {
	ctx := context.Background()

	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("failed to load config: %w", err)
	}

	logger.Init()
	pool, err := database.OpenPool(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed connect db: %w", err)
	}

	//jwt
	adminJWT, err := secure.NewJWTSigner(secure.JWTConfig{
		AccessSecret:       cfg.JWT.AdminAccessSecret,
		RefreshSecret:      cfg.JWT.AdminRefreshSecret,
		AccessTokenExpiry:  cfg.JWT.AdminAccessExpiry,
		RefreshTokenExpiry: cfg.JWT.AdminRefreshExpiry,
		Issuer:             cfg.JWT.Issuer,
		Audience:           cfg.JWT.AdminAudience,
		Leeway:             0, //0 = uses default 30s leeway
	})
	if err != nil {
		logger.Fatal(ctx, "failed to set admin jwt signer", "err", err)
	}

	//store
	adminStore := adminstore.NewAdminPGStore(pool)
	//handlers
	healthHandler := healthhandlers.NewHealthHandler()
	authHandlers := authhandlers.NewAuthHandler()
	return &Application{
		adminJWT,
		adminStore,
		healthHandler,
		authHandlers,
	}, nil
}
