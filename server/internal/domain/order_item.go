package domain

import (
	"gorm.io/gorm"
)

type OrderItem struct {
	gorm.Model
	OrderID   uint
	ProductID uint
	Quantity  int64

	Order   Order   `gorm:"foreignKey:OrderID"`
	Product Product `gorm:"foreignKey:ProductID"`
}
