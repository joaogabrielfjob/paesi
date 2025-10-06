package domain

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name    string
	Company string
	Price   decimal.Decimal
}
