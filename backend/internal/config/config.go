package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Database DatabaseConfig
	App      AppConfig
	JWT      JWTConfig
	Mailer   MailerConfig
}

type DatabaseConfig struct {
	Dsn               string
	MinConns          int32
	MaxConns          int32
	MaxConnLifetime   time.Duration
	MaxConnIdleTime   time.Duration
	HealthCheckPeriod time.Duration
	ConnectTimeout    time.Duration
}

type AppConfig struct {
	Env         string
	BaseURL     string
	FrontendURL string
	Port        string
	Name        string
	Platform    string
}

type JWTConfig struct {
	AccessSecret       string
	AdminAccessSecret  string
	RefreshSecret      string
	AdminRefreshSecret string
	AccessTokenExpiry  time.Duration
	RefreshTokenExpiry time.Duration
	AdminAccessExpiry  time.Duration
	AdminRefreshExpiry time.Duration
	Issuer             string
	Audience           string
	AdminAudience      string
}

type MailerConfig struct {
	SMTPHost                 string
	SMTPPort                 int
	SMTPUsername             string
	SMTPPassword             string
	SMTPFrom                 string
	RequireEmailVerification bool
}

func Load() (*Config, error) {
	// required fields
	dsn := getEnv("DATABASE_URL", "")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	adminAccessSecret := getEnv("ADMIN_JWT_ACCESS_SECRET", "")
	if adminAccessSecret == "" {
		return nil, fmt.Errorf("ADMIN_JWT_ACCESS_SECRET is required")
	}

	adminRefreshSecret := getEnv("ADMIN_JWT_REFRESH_SECRET", "")
	if adminRefreshSecret == "" {
		return nil, fmt.Errorf("ADMIN_JWT_REFRESH_SECRET is required")
	}

	cfg := &Config{
		Database: DatabaseConfig{
			Dsn:               dsn,
			MinConns:          getEnvInt32("DB_MIN_CONNS", 2),
			MaxConns:          getEnvInt32("DB_MAX_CONNS", 10),
			MaxConnLifetime:   getEnvDuration("DB_MAX_CONN_LIFETIME", 1*time.Hour),
			MaxConnIdleTime:   getEnvDuration("DB_MAX_CONN_IDLE_TIME", 30*time.Minute),
			HealthCheckPeriod: getEnvDuration("DB_HEALTH_CHECK_PERIOD", 1*time.Minute),
			ConnectTimeout:    getEnvDuration("DB_CONNECT_TIMEOUT", 5*time.Second),
		},
		App: AppConfig{
			Env:         getEnv("APP_ENV", "dev"),
			BaseURL:     getEnv("APP_URL", "http://localhost:8080"),
			FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
			Port:        getEnv("APP_PORT", "8080"),
			Name:        getEnv("APP_NAME", "pazar-backend"),
			Platform:    getEnv("APP_PLATFORM", "web"),
		},
		JWT: JWTConfig{
			AdminAccessSecret:  adminAccessSecret,
			AdminRefreshSecret: adminRefreshSecret,
			AccessTokenExpiry:  getEnvDuration("JWT_ACCESS_EXPIRE", 15*time.Minute),
			RefreshTokenExpiry: getEnvDuration("JWT_REFRESH_EXPIRE", 168*time.Hour),
			AdminAccessExpiry:  getEnvDuration("ADMIN_JWT_ACCESS_EXPIRE", 15*time.Minute),
			AdminRefreshExpiry: getEnvDuration("ADMIN_JWT_REFRESH_EXPIRE", 24*time.Hour),
			Issuer:             getEnv("JWT_ISSUER", "pazar"),
			Audience:           getEnv("JWT_AUDIENCE", "pazar-app"),
			AdminAudience:      getEnv("ADMIN_JWT_AUDIENCE", "pazar-admin"),
		},
		Mailer: MailerConfig{
			SMTPHost:                 getEnv("SMTP_HOST", "localhost"),
			SMTPPort:                 getEnvInt("SMTP_PORT", 587),
			SMTPUsername:             getEnv("SMTP_USERNAME", ""),
			SMTPPassword:             getEnv("SMTP_PASSWORD", ""),
			SMTPFrom:                 getEnv("SMTP_FROM", "noreply@turkishpazar.us"),
			RequireEmailVerification: getEnvBool("REQUIRE_EMAIL_VERIFICATION", true),
		},
	}

	return cfg, nil
}

// helper functions
func getEnv(key, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}

func getEnvInt32(key string, def int32) int32 {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	i, err := strconv.ParseInt(val, 10, 32)
	if err != nil {
		return def
	}
	return int32(i)
}

func getEnvDuration(key string, def time.Duration) time.Duration {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	d, err := time.ParseDuration(val)
	if err != nil {
		return def
	}
	return d
}

func getEnvBool(key string, def bool) bool {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	b, err := strconv.ParseBool(val)
	if err != nil {
		return def
	}
	return b
}

func getEnvInt(key string, def int) int {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	i, err := strconv.Atoi(val)
	if err != nil {
		return def
	}
	return i
}
