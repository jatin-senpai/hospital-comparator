package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"mediq/internal/database"
	"mediq/internal/middleware"
	"mediq/internal/models"
)

func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ? AND password = ?", req.Email, req.Password).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(middleware.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Token: tokenString,
		User:  user,
	})
}

var otpStore = make(map[string]string)

func SendOTP(c *gin.Context) {
	var req models.SendOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate a random 6-digit OTP (using a mock static one or random)
	// For simplicity in testing, we can use 123456 or a random one. Let's do random.
	otp := "123456" // Hardcoded for demo/resume purposes so they don't get stuck if they miss the log
	otpStore[req.Phone] = otp

	// Print to console to simulate sending SMS
	println("\n==================================================")
	println("📲 MOCK SMS GATEWAY")
	println("To:", req.Phone)
	println("Message: Your MediQ verification code is", otp)
	println("==================================================\n")

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func VerifyOTP(c *gin.Context) {
	var req models.VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	storedOTP, exists := otpStore[req.Phone]
	if !exists || storedOTP != req.OTP {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired OTP"})
		return
	}

	// Clear OTP after successful use
	delete(otpStore, req.Phone)

	// Find or create user based on phone (using phone as email for simplicity in mock)
	var user models.User
	if err := database.DB.Where("email = ?", req.Phone).First(&user).Error; err != nil {
		// Create new user
		user = models.User{
			Email:    req.Phone,
			Password: "otp_login",
			Name:     "User " + req.Phone,
		}
		database.DB.Create(&user)
	}

	// Generate token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(middleware.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Token: tokenString,
		User:  user,
	})
}
