package domain

import "gorm.io/gorm"

type Address struct {
	gorm.Model
	UserID       string `gorm:"uniqueIndex;not null"`
	PostalCode   string
	Country      string
	State        string
	City         string
	Street       string
	Neighborhood string
	Number       string
	Complement   *string

	User User
}
