package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

func userHandler(c *fiber.Ctx) error {
	user := c.Locals("user").(*User)
	return c.JSON(user)
}

func main() {
	app := fiber.New()

	firebaseApp := InitFirebase()
	authClient := InitAuth(firebaseApp)

	// only authenticated admins can access this route
	app.Get("/user", UseAuth(authClient), UseAuthZ("admin"), userHandler)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
