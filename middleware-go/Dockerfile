FROM golang:1.20-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/ /app/cmd

RUN go build -o server ./cmd
EXPOSE 8080

CMD ["/app/server"]
