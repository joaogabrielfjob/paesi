package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joaogabrielfjob/paesi/internal/constants"
	"github.com/joaogabrielfjob/paesi/internal/domain"
	"github.com/joaogabrielfjob/paesi/internal/middleware"
	nanoid "github.com/matoous/go-nanoid/v2"
	"github.com/shopspring/decimal"
)

type CreateOrderRequest struct {
	Products []CreateOrderProduct `json:"products" binding:"required,min=1"`
}

type CreateOrderProduct struct {
	ProductID uint  `json:"productId" binding:"required"`
	Quantity  int64 `json:"quantity" binding:"required,min=1"`
}

func CreateOrder(ctx *gin.Context) {
	userID := middleware.GetAuthenticatedUserID(ctx)

	request := CreateOrderRequest{}

	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	productIDs := make([]uint, len(request.Products))
	productQuantities := make(map[uint]int64)

	for i, rp := range request.Products {
		productIDs[i] = rp.ProductID
		productQuantities[rp.ProductID] = rp.Quantity
	}

	products := []domain.Product{}
	err = db.Find(&products, productIDs).Error
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(products) != len(productIDs) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Some products not found"})
		return
	}

	total := decimal.NewFromInt(0)
	for _, product := range products {
		quantity := decimal.NewFromInt(productQuantities[product.ID])
		total = total.Add(product.Price.Mul(quantity))
	}

	code, err := nanoid.Generate("0123456789", 5)
	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	order := domain.Order{
		UserID: userID,
		Code:   code,
		Status: constants.OrderStatusCreated,
		Total:  total,
	}

	err = db.Create(&order).Error
	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	orderItems := []domain.OrderItem{}
	for _, product := range products {
		orderItem := domain.OrderItem{
			OrderID:   order.ID,
			ProductID: product.ID,
			Quantity:  productQuantities[product.ID],
		}

		orderItems = append(orderItems, orderItem)
	}

	err = db.CreateInBatches(&orderItems, len(orderItems)).Error
	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	ctx.JSON(
		http.StatusCreated,
		"order created",
	)
}
