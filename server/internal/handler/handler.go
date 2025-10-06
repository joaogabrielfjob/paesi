package handler

import (
	"github.com/joaogabrielfjob/paesi/internal/config"
	"gorm.io/gorm"
)

var db *gorm.DB

func Init() {
	db = config.GetDatabase()
}
