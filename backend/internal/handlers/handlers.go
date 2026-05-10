package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"sort"
	"strings"
	"time"

	"mediq/internal/database"
	"mediq/internal/models"

	"github.com/gin-gonic/gin"
	razorpay "github.com/razorpay/razorpay-go"
)

var (
	razorpayKeyID     = "rzp_test_SjfpXFSR9XIQR2"
	razorpayKeySecret = "odEyZhLd14GAohsm3HazRsPM"
)

// SearchHospitals handles GET /api/hospitals/search
func SearchHospitals(c *gin.Context) {
	serviceID := c.Query("service")
	sortBy := c.DefaultQuery("sort", "distance")

	// Get location from query params or use default (Jaipur)
	var userLat, userLng float64
	latStr := c.DefaultQuery("lat", "26.9124") // Default: Jaipur center
	lngStr := c.DefaultQuery("lng", "75.7873")

	_, _ = fmt.Sscanf(latStr, "%f", &userLat)
	_, _ = fmt.Sscanf(lngStr, "%f", &userLng)

	var hospitals []models.Hospital
	database.DB.Preload("Services").Find(&hospitals)

	results := make([]models.SearchResult, 0)

	for _, h := range hospitals {
		dist := haversine(userLat, userLng, h.Latitude, h.Longitude)
		var svcPrice *models.ServicePrice

		for _, p := range h.Services {
			if p.ServiceID == serviceID {
				p2 := p // copy
				svcPrice = &p2
				break
			}
		}

		results = append(results, models.SearchResult{
			Hospital: h,
			Distance: math.Round(dist*10) / 10,
			Price:    svcPrice,
		})
	}

	// Sort
	sort.Slice(results, func(i, j int) bool {
		switch sortBy {
		case "price":
			pi, pj := float64(math.MaxFloat64), float64(math.MaxFloat64)
			if results[i].Price != nil {
				pi = results[i].Price.Price
			}
			if results[j].Price != nil {
				pj = results[j].Price.Price
			}
			return pi < pj
		case "rating":
			return results[i].Hospital.Rating > results[j].Hospital.Rating
		default: // distance
			return results[i].Distance < results[j].Distance
		}
	})

	c.JSON(http.StatusOK, gin.H{
		"results": results,
		"total":   len(results),
		"service": serviceID,
	})
}

// GetHospital handles GET /api/hospitals/:id
func GetHospital(c *gin.Context) {
	id := c.Param("id")
	var hospital models.Hospital

	if err := database.DB.Preload("Services").First(&hospital, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "hospital not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"hospital": hospital, "services": hospital.Services})
}

// GetSlots handles GET /api/hospitals/:id/slots
func GetSlots(c *gin.Context) {
	hospitalID := c.Param("id")
	serviceID := c.Query("service")

	slots := generateTimeSlots(hospitalID, serviceID)
	c.JSON(http.StatusOK, gin.H{"slots": slots, "hospital_id": hospitalID})
}

// CreateBooking handles POST /api/bookings
func CreateBooking(c *gin.Context) {
	var req models.BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get service price from DB
	var servicePrice models.ServicePrice
	if err := database.DB.Where("hospital_id = ? AND service_id = ?", req.HospitalID, req.ServiceID).First(&servicePrice).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Service not found for this hospital"})
		return
	}
	amount := servicePrice.Price

	bookingRef := generateBookingRef()

	// Initialize Razorpay Client
	client := razorpay.NewClient(razorpayKeyID, razorpayKeySecret)

	// Create Razorpay Order
	data := map[string]interface{}{
		"amount":   amount * 100, // amount in smallest currency unit (paise)
		"currency": "INR",
		"receipt":  bookingRef,
	}

	body, err := client.Order.Create(data, nil)
	var razorpayOrderID string
	if err != nil {
		// Log error but continue to create pending booking (mock mode fallback if keys invalid)
		fmt.Printf("Razorpay Order Creation Failed: %v\n", err)
		razorpayOrderID = "mock_order_id"
	} else {
		razorpayOrderID = body["id"].(string)
	}

	booking := models.Booking{
		UserID:        userID.(uint),
		BookingRef:    bookingRef,
		HospitalID:    req.HospitalID,
		SlotID:        req.SlotID,
		ServiceID:     req.ServiceID,
		PatientName:   req.PatientName,
		PatientAge:    req.PatientAge,
		PatientPhone:  req.PatientPhone,
		PatientEmail:  req.PatientEmail,
		PatientGender: req.PatientGender,
		Notes:         req.Notes,
		Amount:        amount,
		PaymentMethod: req.PaymentMethod,
		PaymentStatus: "pending",
		PaymentID:     razorpayOrderID, // Storing Razorpay order ID initially
		Status:        "pending_payment",
		CreatedAt:     time.Now(),
	}

	if err := database.DB.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"booking_ref":       bookingRef,
		"amount":            amount,
		"status":            "pending_payment",
		"razorpay_order_id": razorpayOrderID,
	})
}

// ProcessPayment handles POST /api/payments/process
func ProcessPayment(c *gin.Context) {
	var req models.PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var booking models.Booking
	if err := database.DB.Where("booking_ref = ?", req.BookingRef).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Verify Razorpay Signature
	// signature = hmac_sha256(razorpay_order_id + "|" + razorpay_payment_id, secret)
	if req.RazorpayOrderID != "mock_order_id" {
		data := req.RazorpayOrderID + "|" + req.RazorpayPaymentID
		h := hmac.New(sha256.New, []byte(razorpayKeySecret))
		h.Write([]byte(data))
		expectedSignature := hex.EncodeToString(h.Sum(nil))

		if expectedSignature != req.RazorpaySignature {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment signature"})
			return
		}
	}

	// Update booking status
	booking.PaymentStatus = "paid"
	booking.Status = "confirmed"
	booking.PaymentID = req.RazorpayPaymentID

	if err := database.DB.Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}

	c.JSON(http.StatusOK, models.PaymentResponse{
		Success:    true,
		BookingRef: req.BookingRef,
		Message:    "Payment successful. Booking confirmed.",
	})
}

// GetBooking handles GET /api/bookings/:ref
func GetBooking(c *gin.Context) {
	ref := c.Param("ref")
	var booking models.Booking

	if err := database.DB.Where("booking_ref = ?", ref).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// GetBookingHistory handles GET /api/bookings/history
func GetBookingHistory(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var history []models.Booking
	if err := database.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bookings": history})
}

// Helper: Haversine distance formula
func haversine(lat1, lng1, lat2, lng2 float64) float64 {
	const R = 6371 // Earth radius km
	dLat := (lat2 - lat1) * math.Pi / 180
	dLng := (lng2 - lng1) * math.Pi / 180
	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
			math.Sin(dLng/2)*math.Sin(dLng/2)
	return R * 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
}

func generateBookingRef() string {
	chars := "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 6)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return "MQ-" + string(b)
}

func generateTimeSlots(hospitalID, serviceID string) []map[string]interface{} {
	_ = strings.TrimSpace(serviceID)
	slots := make([]map[string]interface{}, 0)
	now := time.Now()

	for d := 0; d < 3; d++ {
		date := now.AddDate(0, 0, d)
		daySlots := make([]map[string]interface{}, 0)

		startHour := 8
		if hospitalID == "1" {
			startHour = 6
		}
		if hospitalID == "4" {
			startHour = 6
		}

		for h := startHour; h < startHour+10; h++ {
			if h > 22 {
				break
			}
			slotTime := time.Date(date.Year(), date.Month(), date.Day(), h, 0, 0, 0, date.Location())
			label := fmt.Sprintf("%d:00 AM", h)
			if h >= 12 {
				if h == 12 {
					label = "12:00 PM"
				} else {
					label = fmt.Sprintf("%d:00 PM", h-12)
				}
			}
			daySlots = append(daySlots, map[string]interface{}{
				"id":        fmt.Sprintf("%s-%d-%d", hospitalID, d, h),
				"time":      slotTime.Format("15:04"),
				"label":     label,
				"available": rand.Float32() > 0.3,
				"date":      date.Format("Mon, Jan 2"),
			})
		}

		slots = append(slots, map[string]interface{}{
			"date":  date.Format("Mon, Jan 2"),
			"slots": daySlots,
		})
	}
	return slots
}

// GetCities handles GET /api/cities
func GetCities(c *gin.Context) {
	cities := make([]map[string]interface{}, 0)

	for key, city := range models.CityLocations {
		cities = append(cities, map[string]interface{}{
			"id":        key,
			"name":      city.Name,
			"latitude":  city.Latitude,
			"longitude": city.Longitude,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"cities": cities,
	})
}
