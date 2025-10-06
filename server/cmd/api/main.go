package main

import (
	"fmt"

	"github.com/joaogabrielfjob/paesi/internal/config"
	"github.com/joaogabrielfjob/paesi/internal/router"
)

func main() {
	if err := config.Load(); err != nil {
		panic(fmt.Sprintf("error loading config: %s", err))
	}

	router.Init()
}
