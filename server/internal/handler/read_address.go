package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joaogabrielfjob/paesi/internal/domain"
	"github.com/joaogabrielfjob/paesi/internal/middleware"
)

type ReadAddressResponse struct {
	PostalCode   string  `json:"postalCode"`
	Country      string  `json:"country"`
	State        string  `json:"state"`
	City         string  `json:"city"`
	Street       string  `json:"street"`
	Neighborhood string  `json:"neighborhood"`
	Number       string  `json:"number"`
	Complement   *string `json:"complement,omitempty"`
}

func ReadAddress(ctx *gin.Context) {
	userID := middleware.GetAuthenticatedUserID(ctx)

	address := domain.Address{}

	err := db.Where("user_id = ?", userID).Find(&address).Error
	if err != nil {
		ctx.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	response := ReadAddressResponse{
		PostalCode:   address.PostalCode,
		Country:      address.Country,
		State:        address.State,
		City:         address.City,
		Street:       address.Street,
		Neighborhood: address.Neighborhood,
		Number:       address.Number,
		Complement:   address.Complement,
	}

	ctx.JSON(http.StatusOK, response)
}
