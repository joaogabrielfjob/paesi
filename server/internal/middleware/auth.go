package middleware

import (
	"crypto/ed25519"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"id"`
	Email  string `json:"email"`
	Name   string `json:"name"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

type JWKS struct {
	Keys []struct {
		Kty string `json:"kty"`
		Crv string `json:"crv"`
		X   string `json:"x"`
		Kid string `json:"kid"`
	} `json:"keys"`
}

type JWTAuthenticator struct {
	authServerURL string
	jwksCache     *JWKS
	cacheExpiry   time.Time
}

func NewJWTAuthenticator(authServerURL string) *JWTAuthenticator {
	return &JWTAuthenticator{
		authServerURL: strings.TrimSuffix(authServerURL, "/"),
	}
}

func (ja *JWTAuthenticator) RequireAuthentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := ja.extractBearerToken(c)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header with Bearer token required",
			})
			c.Abort()
			return
		}

		userID, err := ja.validateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired token",
			})
			c.Abort()
			return
		}

		c.Set("userID", userID)
		c.Next()
	}
}

func (ja *JWTAuthenticator) extractBearerToken(c *gin.Context) string {
	authHeader := c.GetHeader("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return ""
	}
	return strings.TrimPrefix(authHeader, "Bearer ")
}

func (ja *JWTAuthenticator) validateToken(tokenString string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		keyID, ok := token.Header["kid"].(string)
		if !ok {
			return nil, fmt.Errorf("missing key ID in token header")
		}
		return ja.getPublicKey(keyID)
	})

	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return "", fmt.Errorf("invalid token claims")
	}

	return claims.UserID, nil
}

func (ja *JWTAuthenticator) getPublicKey(keyID string) (ed25519.PublicKey, error) {
	jwks, err := ja.fetchJWKS()
	if err != nil {
		return nil, err
	}

	for _, key := range jwks.Keys {
		if key.Kid == keyID && key.Kty == "OKP" && key.Crv == "Ed25519" {
			publicKeyBytes, err := jwt.NewParser().DecodeSegment(key.X)
			if err != nil {
				return nil, fmt.Errorf("failed to decode public key: %w", err)
			}
			return ed25519.PublicKey(publicKeyBytes), nil
		}
	}

	return nil, fmt.Errorf("public key not found for key ID: %s", keyID)
}

func (ja *JWTAuthenticator) fetchJWKS() (*JWKS, error) {
	if ja.jwksCache != nil && time.Now().Before(ja.cacheExpiry) {
		return ja.jwksCache, nil
	}

	resp, err := http.Get(ja.authServerURL + "/api/auth/jwks")
	if err != nil {
		return nil, fmt.Errorf("failed to fetch JWKS: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("JWKS endpoint returned status %d", resp.StatusCode)
	}

	var jwks JWKS
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return nil, fmt.Errorf("failed to parse JWKS response: %w", err)
	}

	ja.jwksCache = &jwks
	ja.cacheExpiry = time.Now().Add(time.Hour)

	return &jwks, nil
}

func GetAuthenticatedUserID(c *gin.Context) string {
	if userID, exists := c.Get("userID"); exists {
		if id, ok := userID.(string); ok {
			return id
		}
	}
	return ""
}
