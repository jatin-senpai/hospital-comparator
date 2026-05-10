# MediQ — Hospital Service Comparison Platform

> Find, compare, and book diagnostic tests at hospitals near you.

![MediQ](https://img.shields.io/badge/Stack-Go%20%7C%20React%20%7C%20PostgreSQL-C8F04D?style=flat-square&labelColor=0D0D0D)
![Status](https://img.shields.io/badge/Status-In%20Development-2DD4A0?style=flat-square&labelColor=0D0D0D)

---

## What it does

MediQ lets users search for diagnostic tests (X-Ray, MRI, Blood Test, CT Scan, etc.), compare prices and ratings across nearby hospitals, view real-time slot availability on a live map, and book appointments with integrated payment flow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Go 1.21, Gin framework |
| Database | PostgreSQL + GORM |
| Maps | Leaflet.js (OpenStreetMap / CartoDB Dark) |
| Payments | Razorpay (UPI, Cards, Net Banking, Wallets) |
| Auth | JWT |
| Hosting | Railway (backend) + Vercel (frontend) |

---

## Features

- **Smart search** — type any test name, get instant suggestions and auto-matched service ID
- **Live map** — dark-themed Leaflet map with custom price markers per hospital
- **Price comparison** — sort by distance, price, or rating; lowest price highlighted
- **Time slot picker** — 3-day slot grid with real availability per hospital
- **Patient form** — full patient details with gender selector and doctor's notes
- **Payment flow** — UPI, card, net banking, wallet with Razorpay integration
- **Booking confirmation** — unique booking ref, ticket-style receipt, SMS/email simulation

---

## Architecture

```
mediq/
├── frontend/                  # React + Vite SPA
│   └── src/
│       ├── pages/
│       │   ├── SearchPage.jsx     # Hero search UI
│       │   ├── ResultsPage.jsx    # Hospital list + map
│       │   └── BookingPage.jsx    # Slot → Details → Payment → Confirm
│       ├── components/
│       │   ├── HospitalCard.jsx   # Price card with rating
│       │   ├── MapPanel.jsx       # Leaflet map panel
│       │   └── Cursor.jsx         # Custom cursor
│       └── services/
│           └── mockData.js        # Local data (replace with API calls)
│
└── backend/                   # Go REST API
    ├── cmd/server/main.go         # Gin router + server entry
    └── internal/
        ├── handlers/handlers.go   # All route handlers
        ├── middleware/             # CORS, logger, rate limiter, auth
        ├── models/models.go       # All data models
        └── schema.sql             # PostgreSQL schema + seed data
```

---

## API Endpoints

```
GET  /health                          Health check

GET  /api/v1/hospitals/search         Search hospitals by service
     ?service=mri&sort=price

GET  /api/v1/hospitals/:id            Get hospital details
GET  /api/v1/hospitals/:id/slots      Get available time slots
     ?service=xray

POST /api/v1/auth/login               Login and get JWT token
POST /api/v1/bookings                 Create a booking (requires JWT)
GET  /api/v1/bookings/history         Get user's booking history (requires JWT)
GET  /api/v1/bookings/:ref            Get booking by reference

POST /api/v1/payments/process         Process payment (Razorpay Signature Verification)
```

---

## Running Locally

### With Docker (Recommended)
```bash
docker-compose up --build
# → Frontend: http://localhost
# → API: http://localhost:8080
```

### Manual Setup (Frontend)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Database & External Services

You will need a PostgreSQL database (e.g., local, Supabase, Neon) and Razorpay test keys.

1. Add your Razorpay keys to `backend/internal/handlers/handlers.go` and `frontend/src/pages/BookingPage.jsx`.
2. Provide your Postgres connection string when starting the backend:

```bash
export DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
```

### Backend
```bash
cd backend
go get
go run cmd/server/main.go
# → API running on http://localhost:8080
# Migrations and initial data seeding are handled automatically on startup!
```

---

## Key Engineering Decisions

- **Go + Gin** chosen for its concurrency model — goroutines handle concurrent slot availability checks efficiently without callback hell
- **Haversine formula** implemented in Go for accurate distance calculation from user coordinates
- **Pessimistic locking** planned for slot booking to prevent double-booking race conditions
- **CSS Modules** used instead of a component library to demonstrate custom design system ability
- **Leaflet.js** over Google Maps — zero API cost, fully open source, dark tile support via CartoDB

---

## What I'd add next

- [x] Real Razorpay SDK integration
- [x] JWT authentication + user booking history
- [x] Migrate to PostgreSQL with GORM
- [ ] Redis for slot caching and rate limiting
- [x] Docker + docker-compose for one-command local setup
- [ ] WebSocket for real-time slot availability updates
- [ ] Admin dashboard for hospitals to manage slots and pricing

---

## Resume bullet points

> *Built a full-stack hospital diagnostic booking platform using Go (Gin) REST API and React, featuring real-time map-based hospital search, price comparison across services, and an end-to-end appointment booking flow with Razorpay payment integration.*

> *Implemented Haversine-based geospatial sorting in Go, custom Leaflet.js map with live price markers, and a 3-step booking flow (slot selection → patient details → payment) with PostgreSQL-backed persistence.*
