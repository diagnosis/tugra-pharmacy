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
	producthandlers "github.com/diagnosis/tugra-pharmacy/internal/handlers/product"
	"github.com/diagnosis/tugra-pharmacy/internal/spaces"
	adminstore "github.com/diagnosis/tugra-pharmacy/internal/store/admin"
	productstore "github.com/diagnosis/tugra-pharmacy/internal/store/product"
	refreshtokenstore "github.com/diagnosis/tugra-pharmacy/internal/store/refreshtokenstore"
)

type Application struct {
	//jwtSigner
	adminJWT *secure.JWTSigner
	//stores
	adminStore        adminstore.AdminStore
	refreshTokenStore refreshtokenstore.RefreshTokenStore
	productStore      productstore.ProductStore

	//handlers
	healthHandler   *healthhandlers.HealthHandler
	authHandler     *authhandlers.AuthHandler
	productHandlers *producthandlers.ProductHandler
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
	//spaces
	spaceClient, err := spaces.NewClient(cfg)
	if err != nil {
		logger.Fatal(ctx, "failed to connect do space", "err", err)
	}

	//store
	adminStore := adminstore.NewAdminPGStore(pool)
	refreshTokenStore := refreshtokenstore.NewRefreshTokenPGStore(pool)
	productStore := productstore.NewProductPGStore(pool)
	//handlers
	healthHandler := healthhandlers.NewHealthHandler()
	authHandlers := authhandlers.NewAuthHandler(cfg, adminJWT, adminStore, refreshTokenStore)
	productHandler := producthandlers.NewProductHandler(cfg, productStore, spaceClient)
	return &Application{
		adminJWT,
		adminStore,
		refreshTokenStore,
		productStore,
		healthHandler,
		authHandlers,
		productHandler,
	}, nil
}
