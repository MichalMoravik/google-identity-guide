package config

import (
    "context"
    "os"
    "log"

    firebase "firebase.google.com/go"
    "firebase.google.com/go/auth"
)

func InitFirebase() *firebase.App {
    conf := &firebase.Config{ProjectID: os.Getenv("GCP_PROJECT_ID")}
    app, err := firebase.NewApp(context.Background(), conf)
    if err != nil {
        log.Printf("error initializing app: %v\n", err)
        return nil
    }

    return app
}

func InitFirebaseAuth(app *firebase.App) *auth.Client {
    client, err := app.Auth(context.Background())
    if err != nil {
        log.Printf("error initializing firebase auth client: %v\n", err)
        return nil
    }

    return client
}
