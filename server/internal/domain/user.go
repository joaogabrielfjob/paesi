package domain

import (
	"time"
)

type User struct {
	ID            string
	Name          string
	Email         string `gorm:"unique"`
	Phone         *string
	EmailVerified bool
	Image         *string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
