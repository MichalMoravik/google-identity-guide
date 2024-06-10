FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o serverd ./cmd

FROM alpine:latest

WORKDIR /app

# Copy only the compiled binary from the builder stage
COPY --from=builder /app/serverd .

# Could be removed and set by some outside config/env vars
ENV PORT=8080

EXPOSE 8080

CMD ["./serverd"]
