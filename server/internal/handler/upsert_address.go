package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joaogabrielfjob/paesi/internal/domain"
	"github.com/joaogabrielfjob/paesi/internal/middleware"
	"gorm.io/gorm/clause"
)

type UpsertAddressRequest struct {
	PostalCode   string  `json:"postalCode"`
	Country      string  `json:"country"`
	State        string  `json:"state"`
	City         string  `json:"city"`
	Street       string  `json:"street"`
	Neighborhood string  `json:"neighborhood"`
	Number       string  `json:"number"`
	Complement   *string `json:"complement,omitempty"`
}

func UpsertAddress(ctx *gin.Context) {
	userID := middleware.GetAuthenticatedUserID(ctx)

	request := UpsertAddressRequest{}

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

	address := domain.Address{
		UserID:       userID,
		PostalCode:   request.PostalCode,
		Country:      request.Country,
		State:        request.State,
		City:         request.City,
		Street:       request.Street,
		Neighborhood: request.Neighborhood,
		Number:       request.Number,
		Complement:   request.Complement,
	}

	err = db.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "user_id"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"postal_code",
			"country",
			"state",
			"city",
			"street",
			"neighborhood",
			"number",
			"complement",
			"updated_at",
		}),
	}).Create(&address).Error

	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{})
}
