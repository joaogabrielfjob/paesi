package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joaogabrielfjob/paesi/internal/constants"
	"github.com/joaogabrielfjob/paesi/internal/domain"
	"github.com/joaogabrielfjob/paesi/internal/middleware"
)

type ReadOrdersResponse struct {
	ID                  uint                  `json:"id"`
	Code                string                `json:"code"`
	Status              constants.OrderStatus `json:"status"`
	CreatedAt           time.Time             `json:"createdAt"`
	EstimatedDeliveryIn *time.Time            `json:"estimatedDeliveryIn,omitempty"`
	DeliveredAt         *time.Time            `json:"deliveredAt,omitempty"`
	DeletedAt           *time.Time            `json:"deletedAt,omitempty"`
}

func ReadOrders(ctx *gin.Context) {
	userID := middleware.GetAuthenticatedUserID(ctx)

	orders := []domain.Order{}

	query := db.Where("user_id = ?", userID).Unscoped()

	err := query.Find(&orders).Error
	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	response := make([]ReadOrdersResponse, len(orders))
	for i, order := range orders {
		var deletedAt *time.Time
		if order.DeletedAt.Valid {
			deletedAt = &order.DeletedAt.Time
		}

		response[i] = ReadOrdersResponse{
			ID:                  order.ID,
			Code:                order.Code,
			Status:              order.Status,
			CreatedAt:           order.CreatedAt,
			EstimatedDeliveryIn: order.EstimatedDeliveryIn,
			DeliveredAt:         order.DeliveredAt,
			DeletedAt:           deletedAt,
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"orders": response,
	})
}
