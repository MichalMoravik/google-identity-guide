package main

import (
	"log"
	"os"

	s "middleware-go/cmd/serverd"

	"github.com/gofiber/fiber/v2"
)

func userHandler(c *fiber.Ctx) error {
	user := c.Locals("user").(*s.User)
	return c.JSON(user)
}

func main() {
	app := fiber.New()

	firebaseApp := s.InitFirebase()
	authClient := s.InitAuth(firebaseApp)

	// only authenticated admins can access this route
	app.Get("/user", s.UseAuth(authClient), s.UseAuthZ("admin"), userHandler)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
