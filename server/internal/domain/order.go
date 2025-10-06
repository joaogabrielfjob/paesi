package domain

import (
	"time"

	"github.com/joaogabrielfjob/paesi/internal/constants"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	UserID              string
	Code                string
	Status              constants.OrderStatus
	Total               decimal.Decimal
	EstimatedDeliveryIn *time.Time
	DeliveredAt         *time.Time

	User       User
	OrderItems []OrderItem
}
