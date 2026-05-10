package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"mediq/internal/models"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Fallback to local postgres for development
		dsn = "host=localhost user=postgres password=postgres dbname=mediq port=5432 sslmode=disable"
		log.Println("WARNING: DATABASE_URL not set. Falling back to local postgres configuration.")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	DB = db

	// Auto-migrate the schemas
	log.Println("Running AutoMigrate...")
	err = DB.AutoMigrate(
		&models.User{},
		&models.Hospital{},
		&models.ServicePrice{},
		&models.TimeSlot{},
		&models.Booking{},
	)
	if err != nil {
		log.Fatalf("Failed to auto-migrate: %v", err)
	}

	seedData()

	log.Println("Database connection established and migrations run successfully")
}

func seedData() {
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count == 0 {
		DB.Create(&models.User{
			Email:    "test@mediq.com",
			Password: "password123",
			Name:     "Test User",
		})
	}

	DB.Model(&models.Hospital{}).Count(&count)
	if count == 0 {
		hospitals := []models.Hospital{
			// Jaipur
			{Name: "Apollo Diagnostics", Address: "Sector 12, Jaipur", Latitude: 26.9220, Longitude: 75.8110, Rating: 4.8, ReviewCount: 2341, Badge: "NABH Accredited", BadgeColor: "teal", Phone: "+91 98100 12345", OpenHours: "6:00 AM – 10:00 PM"},
			{Name: "Fortis Health Hub", Address: "Malviya Nagar, Jaipur", Latitude: 26.8994, Longitude: 75.8069, Rating: 4.6, ReviewCount: 1892, Badge: "ISO Certified", BadgeColor: "amber", Phone: "+91 98200 56789", OpenHours: "7:00 AM – 9:00 PM"},
			{Name: "Max LifeCare Center", Address: "C-Scheme, Jaipur", Latitude: 26.9165, Longitude: 75.7920, Rating: 4.5, ReviewCount: 987, Badge: "CAP Certified", BadgeColor: "chalk", Phone: "+91 98300 11223", OpenHours: "8:00 AM – 8:00 PM"},
			{Name: "Medanta Diagnostics", Address: "Vaishali Nagar, Jaipur", Latitude: 26.9289, Longitude: 75.7594, Rating: 4.9, ReviewCount: 3102, Badge: "NABL Accredited", BadgeColor: "teal", Phone: "+91 98400 77889", OpenHours: "5:30 AM – 11:00 PM"},
			
			// Delhi
			{Name: "Max Super Speciality", Address: "Saket, Delhi", Latitude: 28.5273, Longitude: 77.2183, Rating: 4.7, ReviewCount: 4210, Badge: "JCI Accredited", BadgeColor: "chalk", Phone: "+91 99100 22334", OpenHours: "24 Hours"},
			{Name: "Dr. Lal PathLabs", Address: "Rohini, Delhi", Latitude: 28.7360, Longitude: 77.1128, Rating: 4.4, ReviewCount: 1543, Badge: "NABL Accredited", BadgeColor: "teal", Phone: "+91 99200 44556", OpenHours: "6:00 AM - 9:00 PM"},
			
			// Mumbai
			{Name: "Lilavati Hospital", Address: "Bandra West, Mumbai", Latitude: 19.0515, Longitude: 72.8252, Rating: 4.8, ReviewCount: 5632, Badge: "NABH Accredited", BadgeColor: "teal", Phone: "+91 88100 99887", OpenHours: "24 Hours"},
			{Name: "Metropolis Healthcare", Address: "Andheri, Mumbai", Latitude: 19.1136, Longitude: 72.8697, Rating: 4.5, ReviewCount: 2198, Badge: "ISO Certified", BadgeColor: "amber", Phone: "+91 88200 11223", OpenHours: "7:00 AM - 10:00 PM"},
		}
		DB.Create(&hospitals)

		// Create service prices for all hospitals
		var prices []models.ServicePrice
		for i := 1; i <= 8; i++ {
			prices = append(prices, []models.ServicePrice{
				{HospitalID: uint(i), ServiceID: "xray", ServiceName: "X-Ray", Price: float64(300 + (i * 20)), Duration: 15, ReportTime: "2 hrs", Available: true},
				{HospitalID: uint(i), ServiceID: "mri", ServiceName: "MRI Scan", Price: float64(4000 + (i * 200)), Duration: 45, ReportTime: "24 hrs", Available: true},
				{HospitalID: uint(i), ServiceID: "ct", ServiceName: "CT Scan", Price: float64(3000 + (i * 100)), Duration: 30, ReportTime: "6 hrs", Available: true},
				{HospitalID: uint(i), ServiceID: "blood", ServiceName: "Blood Test", Price: float64(150 + (i * 10)), Duration: 10, ReportTime: "6 hrs", Available: true},
				{HospitalID: uint(i), ServiceID: "ecg", ServiceName: "ECG", Price: float64(200 + (i * 20)), Duration: 20, ReportTime: "1 hr", Available: true},
				{HospitalID: uint(i), ServiceID: "ultrasound", ServiceName: "Ultrasound", Price: float64(700 + (i * 50)), Duration: 25, ReportTime: "2 hrs", Available: true},
				{HospitalID: uint(i), ServiceID: "thyroid", ServiceName: "Thyroid Panel", Price: float64(600 + (i * 30)), Duration: 10, ReportTime: "12 hrs", Available: true},
			}...)
		}
		DB.Create(&prices)
	}
}
