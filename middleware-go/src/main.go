package main

import (
    "os"
    "log"

    c "middleware-go/src/config"
    mw "middleware-go/src/middlewares"
    m "middleware-go/src/models"

    "github.com/gofiber/fiber/v2"
)

func userHandler(c *fiber.Ctx) error {
    // return the user from context as json 200 response
    user := c.Locals("user").(*m.User)
    return c.JSON(user)
}

func main() {
    app := fiber.New()

    firebaseApp := c.InitFirebase()
    authClient := c.InitFirebaseAuth(firebaseApp)

    app.Get("/user", mw.UseAuth(authClient), userHandler)

    log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}

