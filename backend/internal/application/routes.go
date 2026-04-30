package application

import (
	"time"

	"github.com/diagnosis/go-toolkit/middleware"
	"github.com/go-chi/chi/v5"
	"golang.org/x/time/rate"
)

func SetupRoutes(app *Application) *chi.Mux {
	allowedOrigins := []string{
		"http://localhost:5173",
	}

	r := chi.NewRouter()
	r.Use(middleware.CorrelationID())
	r.Use(middleware.RequestLogger())
	r.Use(middleware.CORS(allowedOrigins))

	//health
	r.Get("/api/health", app.healthHandler.HandleHealth)
	//public
	r.Get("/api/products", app.productHandlers.List)
	r.Get("/api/products/{id}", app.productHandlers.GetByID)

	//auth
	r.Route("/api/auth", func(r chi.Router) {
		r.Use(middleware.RateLimit(rate.Every(time.Minute), 10, 5*time.Second))
		r.Post("/login", app.authHandler.HandleLogin)
		r.Post("/refresh", app.authHandler.HandleRefresh)
		r.Post("/logout", app.authHandler.HandleLogout)
	})
	//protected
	r.Route("/api/admin", func(r chi.Router) {
		r.Use(middleware.RequireAuth(AdminAuthFunction(app.adminJWT)))
		r.Post("/products", app.productHandlers.Create)
		r.Put("/products/{id}", app.productHandlers.Update)
		r.Delete("/products/{id}", app.productHandlers.Delete)
	})

	return r
}
