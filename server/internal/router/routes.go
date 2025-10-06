package router

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joaogabrielfjob/paesi/internal/handler"
	"github.com/joaogabrielfjob/paesi/internal/middleware"
)

func initializeRoutes(router *gin.Engine) {
	handler.Init()

	authURL := os.Getenv("AUTH_URL")
	auth := middleware.NewJWTAuthenticator(authURL)
	router.Use(auth.RequireAuthentication())

	{
		router.GET("/products", handler.ReadProducts)
		router.POST("/orders", handler.CreateOrder)
		router.GET("/orders", handler.ReadOrders)
		router.GET("/users/:id", handler.ReadUser)
		router.PUT("/address", handler.UpsertAddress)
		router.GET("/address", handler.ReadAddress)
	}
}
