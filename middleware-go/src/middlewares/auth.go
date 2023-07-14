package middlewares

import (
    "log"
    "strings"
    "context"

    m "middleware-go/src/models"

    "github.com/gofiber/fiber/v2"
    "firebase.google.com/go/auth"
)

type AuthClient interface {
	VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error)
}

func UseAuth(authClient AuthClient) fiber.Handler {
    return func(c *fiber.Ctx) error {
        log.Println("In Auth middleware")

        authHeader := c.Get("Authorization")
        if authHeader == "" {
            log.Println("Missing Authorization header")
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "message": "Missing Authorization header",
            })
        }

        // Bearer token split to get the token without "Bearer" in front
        val := strings.Split(authHeader, " ")
        if len(val) != 2 {
            log.Println("Invalid Authorization header")
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "message": "Invalid Authorization header",
            })
        }
        token := val[1]

        decodedToken, err := authClient.VerifyIDToken(c.Context(), token)
        if err != nil {
            log.Printf("Error verifying token. Error: %v\n", err)
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "message": "Invalid authentication token",
            })
        }

        if _, ok := decodedToken.Claims["role"]; !ok {
            log.Println("Role not present in token")
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "message": "Invalid authentication token",
            })
        }

        user := &m.User{
            UID: decodedToken.UID,
            Email: decodedToken.Claims["email"].(string),
            Role: decodedToken.Claims["role"].(string),
        }
        c.Locals("user", user)

        log.Println("Successfully authenticated")
        log.Printf("Email: %v\n", user.Email)
        log.Printf("Role: %v\n", user.Role)

        return c.Next()
    }
}

