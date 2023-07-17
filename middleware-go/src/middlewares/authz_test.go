package middlewares

import (
	"net/http/httptest"
	"testing"

	m "middleware-go/src/models"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAuthZMiddleware(t *testing.T) {
    tests := []struct {
        role string
        requiredRole string
        testName string
        expected int
    }{
        {
            role: "user",
            requiredRole: "admin",
            testName: "Should fail as user role is not admin",
            expected: 403,
        },
        {
            role: "",
            requiredRole: "admin",
            testName: "Should fail as user role is not set",
            expected: 401,
        },
        {
            role: "admin",
            requiredRole: "admin",
            testName: "Should pass as user role is admin",
            expected: 200,
        },
    }

    for _, test := range tests {
        t.Run(test.testName, func(t *testing.T) {
            app := fiber.New()
            // adding user to context as we test only the authorization part
            user := &m.User{
                UID: "UID123",
                Email: "x@gmail.com",
                Role: test.role,
            }
            app.Use(func(c *fiber.Ctx) error {
                c.Locals("user", user)
                return c.Next()
            })

            app.Get("/", UseAuthZ(test.requiredRole), func(c *fiber.Ctx) error {
                return c.SendString("Success")
            })
            req := httptest.NewRequest("GET", "/", nil)

            resp, err := app.Test(req)
            require.NoError(t, err)
            assert.Equal(t, test.expected, resp.StatusCode)
        })
    }

    t.Run("Should fail as user is not present in context", func(t *testing.T) {
        app := fiber.New()
        app.Get("/", UseAuthZ("admin"), func(c *fiber.Ctx) error {
            return c.SendString("Success")
        })
        req := httptest.NewRequest("GET", "/", nil)

        resp, err := app.Test(req)
        require.NoError(t, err)
        assert.Equal(t, 401, resp.StatusCode)
    })
}
