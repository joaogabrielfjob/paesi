package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joaogabrielfjob/paesi/internal/domain"
	"github.com/joaogabrielfjob/paesi/internal/middleware"
)

type ReadUserResponse struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}

func ReadUser(ctx *gin.Context) {
	id := ctx.Param("id")
	userID := middleware.GetAuthenticatedUserID(ctx)

	if id != userID {
		ctx.JSON(
			http.StatusForbidden,
			gin.H{
				"error": "você não pode acessar estes dados",
			},
		)
		return
	}

	user := domain.User{}

	err := db.Find(&user, "id = ?", id).Error
	if err != nil {
		ctx.JSON(
			http.StatusNotFound,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	response := ReadUserResponse{
		Name:  user.Name,
		Email: user.Email,
		Phone: *user.Phone,
	}

	ctx.JSON(http.StatusOK, response)
}
