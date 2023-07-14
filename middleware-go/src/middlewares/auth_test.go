package middlewares

import (
    "testing"
    "context"
    "net/http/httptest"

    m "middleware-go/src/models"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/stretchr/testify/require"
    "firebase.google.com/go/auth"
    "github.com/gofiber/fiber/v2"
)

type MockAuthClient struct {
    mock.Mock
}

func (m *MockAuthClient) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
    args := m.Called(ctx, idToken)
    return args.Get(0).(*auth.Token), args.Error(1)
}

func TestAuthMiddlewareSuccess(t *testing.T) {
    t.Run("Should succeed as token was present and returned all necessary information",
    func(t *testing.T) {
        authClient := new(MockAuthClient)
        token := &auth.Token{
            UID:    "UID123",
            Claims: map[string]interface{}{"email": "x@gmail.com", "role": "admin"},
        }
        authClient.On("VerifyIDToken", mock.Anything, "token123").Return(token, nil)

        app := fiber.New()
        app.Get("/", UseAuth(authClient), func(c *fiber.Ctx) error {
            // user should be present at this stage
            user := c.Locals("user").(*m.User)

            assert.Equal(t, "UID123", user.UID)
            assert.Equal(t, "x@gmail.com", user.Email)
            assert.Equal(t, "admin", user.Role)

            return c.SendString("Success")
        })

        req := httptest.NewRequest("GET", "/", nil)
        req.Header.Set("Authorization", "Bearer token123")
        resp, err := app.Test(req)
        require.NoError(t, err)

        assert.Equal(t, 200, resp.StatusCode)
        authClient.AssertExpectations(t)
    })
}

func TestAuthMiddlewareFailures(t *testing.T) {
    t.Run("Should fail as Authorization header is missing", func(t *testing.T) {
        authClient := new(MockAuthClient)

        app := fiber.New()
        app.Get("/", UseAuth(authClient), func(c *fiber.Ctx) error {
            return c.SendString("Success")
        })

        req := httptest.NewRequest("GET", "/", nil)
        resp, err := app.Test(req)
        require.NoError(t, err)

        assert.Equal(t, 401, resp.StatusCode)
        authClient.AssertExpectations(t)
    })

    t.Run("Should fail as Authorization header is invalid", func(t *testing.T) {
        authClient := new(MockAuthClient)

        app := fiber.New()
        app.Get("/", UseAuth(authClient), func(c *fiber.Ctx) error {
            return c.SendString("Success")
        })

        req := httptest.NewRequest("GET", "/", nil)
        req.Header.Set("Authorization", "Bearer")
        resp, err := app.Test(req)
        require.NoError(t, err)

        assert.Equal(t, 401, resp.StatusCode)
        authClient.AssertExpectations(t)
    })

    t.Run("Should fail if token verification func returns an error", func(t *testing.T) {
        authClient := new(MockAuthClient)
        token := &auth.Token{}
        authClient.On("VerifyIDToken", mock.Anything, "token123").Return(token, assert.AnError)

        app := fiber.New()
        app.Get("/", UseAuth(authClient), func(c *fiber.Ctx) error {
            return c.SendString("Success")
        })

        req := httptest.NewRequest("GET", "/", nil)
        req.Header.Set("Authorization", "Bearer token123")
        resp, err := app.Test(req)
        require.NoError(t, err)

        assert.Equal(t, 401, resp.StatusCode)
        authClient.AssertExpectations(t)
    })

    t.Run("Should fail as user is required to have a role", func(t *testing.T) {
        authClient := new(MockAuthClient)
        token := &auth.Token{
            UID:    "UID123",
            Claims: map[string]interface{}{"email": "x@gmail.com"},
        }
        authClient.On("VerifyIDToken", mock.Anything, "token123").Return(token, nil)

        app := fiber.New()
        app.Get("/", UseAuth(authClient), func(c *fiber.Ctx) error {
            return c.SendString("Success")
        })

        req := httptest.NewRequest("GET", "/", nil)
        req.Header.Set("Authorization", "Bearer token123")
        resp, err := app.Test(req)
        require.NoError(t, err)

        assert.Equal(t, 401, resp.StatusCode)
        authClient.AssertExpectations(t)
    })
}

