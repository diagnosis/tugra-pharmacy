package application

import (
	"net/http"
	"strings"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/secure"
)

func AdminAuthFunction(jwtSigner *secure.JWTSigner) func(r *http.Request) (string, error) {
	return func(r *http.Request) (string, error) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			return "", errors.Unauthorized("missing authorization header", "no auth header")
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return "", errors.Unauthorized("invalid authorization format", "malformed header")
		}

		claims, err := jwtSigner.VerifyAccess(parts[1])
		if err != nil {
			return "", errors.Unauthorized("invalid token", "jwt validation failed", err)
		}
		return claims.Sub, nil
	}
}
