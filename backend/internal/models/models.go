package models

import "time"

// CityCoordinates holds latitude and longitude for major cities
type CityCoordinates struct {
	Name      string
	Latitude  float64
	Longitude float64
}

var CityLocations = map[string]CityCoordinates{
	"jaipur": {
		Name:      "Jaipur",
		Latitude:  26.9124,
		Longitude: 75.7873,
	},
	"delhi": {
		Name:      "Delhi",
		Latitude:  28.7041,
		Longitude: 77.1025,
	},
	"mumbai": {
		Name:      "Mumbai",
		Latitude:  19.0760,
		Longitude: 72.8777,
	},
	"bangalore": {
		Name:      "Bangalore",
		Latitude:  12.9716,
		Longitude: 77.5946,
	},
	"hyderabad": {
		Name:      "Hyderabad",
		Latitude:  17.3850,
		Longitude: 78.4867,
	},
	"pune": {
		Name:      "Pune",
		Latitude:  18.5204,
		Longitude: 73.8567,
	},
}

type User struct {
	ID       uint   `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"` // Hash in real app, plain for mock
	Name     string `json:"name"`
}

type Hospital struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name"`
	Address     string         `json:"address"`
	Latitude    float64        `json:"latitude"`
	Longitude   float64        `json:"longitude"`
	Rating      float64        `json:"rating"`
	ReviewCount int            `json:"review_count"`
	Badge       string         `json:"badge"`
	BadgeColor  string         `json:"badge_color"`
	Phone       string         `json:"phone"`
	OpenHours   string         `json:"open_hours"`
	Established int            `json:"established"`
	CreatedAt   time.Time      `json:"created_at"`
	Services    []ServicePrice `json:"services,omitempty" gorm:"foreignKey:HospitalID"`
}

type ServicePrice struct {
	ID          uint    `json:"id" gorm:"primaryKey"`
	HospitalID  uint    `json:"hospital_id"`
	ServiceID   string  `json:"service_id"`
	ServiceName string  `json:"service_name"`
	Price       float64 `json:"price"`
	Duration    int     `json:"duration_minutes" gorm:"column:duration_min"`
	ReportTime  string  `json:"report_time"`
	Available   bool    `json:"available"`
}

type TimeSlot struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	HospitalID uint      `json:"hospital_id"`
	DateTime   time.Time `json:"datetime" gorm:"column:slot_time"`
	Available  bool      `json:"available"`
	ServiceID  string    `json:"service_id"`
	BookedAt   time.Time `json:"booked_at"`
}

type Booking struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	UserID        uint      `json:"user_id"`
	BookingRef    string    `json:"booking_ref" gorm:"uniqueIndex"`
	HospitalID    uint      `json:"hospital_id"`
	SlotID        uint      `json:"slot_id"`
	ServiceID     string    `json:"service_id"`
	PatientName   string    `json:"patient_name"`
	PatientAge    int       `json:"patient_age"`
	PatientPhone  string    `json:"patient_phone"`
	PatientEmail  string    `json:"patient_email"`
	PatientGender string    `json:"patient_gender"`
	Notes         string    `json:"notes"`
	Amount        float64   `json:"amount"`
	PaymentMethod string    `json:"payment_method"`
	PaymentStatus string    `json:"payment_status"`
	PaymentID     string    `json:"payment_id"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
}

// Request/Response types
type SearchRequest struct {
	Query     string  `json:"query"`
	ServiceID string  `json:"service_id"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
	SortBy    string  `json:"sort_by"`
}

type SearchResult struct {
	Hospital Hospital      `json:"hospital"`
	Distance float64       `json:"distance_km"`
	Price    *ServicePrice `json:"service_price"`
}

type BookingRequest struct {
	HospitalID    uint   `json:"hospital_id" binding:"required"`
	SlotID        uint   `json:"slot_id" binding:"required"`
	ServiceID     string `json:"service_id" binding:"required"`
	PatientName   string `json:"patient_name" binding:"required"`
	PatientAge    int    `json:"patient_age" binding:"required"`
	PatientPhone  string `json:"patient_phone" binding:"required"`
	PatientEmail  string `json:"patient_email"`
	PatientGender string `json:"patient_gender"`
	Notes         string `json:"notes"`
	PaymentMethod string `json:"payment_method" binding:"required"`
}

type PaymentRequest struct {
	BookingRef        string `json:"booking_ref"`
	RazorpayPaymentID string `json:"razorpay_payment_id"`
	RazorpayOrderID   string `json:"razorpay_order_id"`
	RazorpaySignature string `json:"razorpay_signature"`
}

type PaymentResponse struct {
	Success    bool   `json:"success"`
	BookingRef string `json:"booking_ref"`
	Message    string `json:"message"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type SendOTPRequest struct {
	Phone string `json:"phone" binding:"required"`
}

type VerifyOTPRequest struct {
	Phone string `json:"phone" binding:"required"`
	OTP   string `json:"otp" binding:"required"`
}
