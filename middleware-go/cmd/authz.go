package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func UseAuthZ(requiredRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Println("In AuthZ middleware")

		user, ok := c.Locals("user").(*User)
		if !ok {
			log.Println("User not found in context")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Unauthorized",
			})
		}

		if user.Role == "" {
			log.Println("User role not set")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Unauthorized",
			})
		}

		if user.Role != requiredRole {
			log.Printf("User with email %s and role %s tried to access "+
				"a route that was for the %s role only",
				user.Email, user.Role, requiredRole)
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "Forbidden",
			})
		}

		log.Printf("User with email %s and role %s authorized",
			user.Email, user.Role)

		return c.Next()
	}
}
