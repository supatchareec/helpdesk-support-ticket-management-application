package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type Ticket struct {
	Id          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Contact     string    `json:"contact"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdateAt    time.Time `json:"updateAt"`
	Status      string    `json:"status"`
}

type ticketArray []Ticket

func readJson() ticketArray {
	file, err := ioutil.ReadFile("./document.json")
	if err != nil {
		log.Fatal(err)
	}
	m := ticketArray{}
	err = json.Unmarshal(file, &m)
	if err != nil {
		log.Fatal(err)
	}

	return m
}

func writeJson(data ticketArray) {
	json_to_file, _ := json.Marshal(data)
	err := ioutil.WriteFile("./document.json", json_to_file, 4)
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	e.GET("/tickets", func(c echo.Context) error {
		tickets := readJson()

		return c.JSON(http.StatusOK, tickets)
	})

	e.GET("/ticket/:id", func(c echo.Context) error {
		tickets := readJson()

		for _, ticket := range tickets {
			if c.Param("id") == strconv.Itoa(ticket.Id) {
				return c.JSON(http.StatusOK, ticket)
			}
		}
		return c.String(http.StatusNotFound, "Not found.")
	})

	e.POST("/ticket", func(c echo.Context) error {
		tickets := readJson()

		new_ticket := new(Ticket)
		err := c.Bind(new_ticket)
		if err != nil {
			return c.String(http.StatusBadRequest, "Bad request.")
		}

		tickets = append(tickets, *new_ticket)
		writeJson(tickets)

		return c.JSON(http.StatusOK, tickets)
	})

	e.PUT("/ticket/:id", func(c echo.Context) error {
		tickets := readJson()

		updated_ticket := new(Ticket)
		err := c.Bind(updated_ticket)
		if err != nil {
			return c.String(http.StatusBadRequest, "Bad request.")
		}

		for i, ticket := range tickets {
			if strconv.Itoa(ticket.Id) == c.Param("id") {
				tickets = append(tickets[:i], tickets[i+1:]...)
				tickets = append(tickets, *updated_ticket)

				writeJson(tickets)

				return c.JSON(http.StatusOK, tickets)
			}
		}

		return c.String(http.StatusNotFound, "Not found.")
	})

	e.Start(":8080")
}
