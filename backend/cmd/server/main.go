package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"mediq/internal/database"
	"mediq/internal/handlers"
	"mediq/internal/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("GIN_MODE")
	if env == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize Database
	database.Connect()

	r := gin.New()

	// Middleware
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())
	r.Use(middleware.RateLimiter())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "MediQ API"})
	})

	// API v1
	v1 := r.Group("/api/v1")
	{
		// Hospital routes
		hospitals := v1.Group("/hospitals")
		{
			hospitals.GET("/search", handlers.SearchHospitals)
			hospitals.GET("/:id", handlers.GetHospital)
			hospitals.GET("/:id/slots", handlers.GetSlots)
		}

		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
			auth.POST("/signup", handlers.Signup)
		}

		// Booking routes
		bookings := v1.Group("/bookings")
		bookings.Use(middleware.AuthMiddleware())
		{
			bookings.POST("", handlers.CreateBooking)
			bookings.GET("/history", handlers.GetBookingHistory)
			bookings.GET("/:ref", handlers.GetBooking)
			bookings.GET("/:ref/report", handlers.DownloadReport)
		}

		// Payment routes
		payments := v1.Group("/payments")
		{
			payments.POST("/process", handlers.ProcessPayment)
		}
	}

	log.Printf("🏥 MediQ API running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
