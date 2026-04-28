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

	//auth
	r.Route("/api/auth", func(r chi.Router) {
		r.Use(middleware.RateLimit(rate.Every(time.Minute), 10, 5*time.Second))
		r.Post("/login", app.authHandler.HandleLogin)
	})
	//protected
	r.Route("/api/admin", func(r chi.Router) {
		r.Use(middleware.RequireAuth(AdminAuthFunction(app.adminJWT)))
	})

	return r
}
