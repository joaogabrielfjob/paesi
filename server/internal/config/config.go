package config

import (
	"fmt"

	"github.com/joaogabrielfjob/paesi/internal/db"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

var (
	err      error
	database *gorm.DB
)

func Load() error {
	err = godotenv.Load()
	if err != nil {
		return fmt.Errorf("error loading env file: %v", err)
	}

	database, err = db.Init()
	if err != nil {
		return fmt.Errorf("error initiliazing db: %v", err)
	}

	return nil
}

func GetDatabase() *gorm.DB {
	return database
}
