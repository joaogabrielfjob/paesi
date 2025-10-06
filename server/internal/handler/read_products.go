package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joaogabrielfjob/paesi/internal/domain"
	"github.com/shopspring/decimal"
)

type ReadProductsResponse struct {
	ID      uint            `json:"id"`
	Name    string          `json:"name"`
	Company string          `json:"company"`
	Price   decimal.Decimal `json:"price"`
}

func ReadProducts(ctx *gin.Context) {
	products := []domain.Product{}

	err := db.Find(&products).Error
	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	response := make([]ReadProductsResponse, len(products))
	for i, product := range products {
		response[i] = ReadProductsResponse{
			ID:      product.ID,
			Name:    product.Name,
			Company: product.Company,
			Price:   product.Price,
		}
	}

	ctx.JSON(
		http.StatusOK,
		gin.H{
			"products": response,
		},
	)
}
