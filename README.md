# MediQ — Diagnostic Hospital Booking Platform

> Find, compare, and book diagnostic tests at top-rated hospitals near you.

![MediQ](https://img.shields.io/badge/Stack-Go%20%7C%20React%20%7C%20PostgreSQL-0ea5e9?style=flat-square&labelColor=0f172a)
![Status](https://img.shields.io/badge/Status-Production%20Ready-2DD4A0?style=flat-square&labelColor=0f172a)

---

## 🚀 Overview

**MediQ** is a production-ready, full-stack web application that allows users to seamlessly search for diagnostic medical tests (e.g., X-Rays, MRI Scans, Blood Tests), compare real-time prices and availability across nearby hospitals, and book appointments through a secure, integrated payment gateway.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Custom CSS Modules ("Medical Light" Design System)
- **Maps:** Leaflet.js (OpenStreetMap API)
- **Payments Integration:** Razorpay SDK

### Backend
- **Language:** Go (Golang) 1.21+
- **Framework:** Gin Web Framework
- **Database:** PostgreSQL (NeonDB)
- **ORM:** GORM
- **Authentication:** JWT (JSON Web Tokens) + Secure OTP Flow
- **Payment Verification:** HMAC-SHA256 Signature Validation

### DevOps & Infrastructure
- **Containerization:** Docker & Docker Compose
- **Backend/DB Hosting:** Render (Automated via `render.yaml` Blueprints)
- **Frontend Hosting:** Vercel

---

## ✨ Key Features

- **Smart Search Engine:** Built-in query normalization (e.g., handling spaces and hyphens so "x ray" flawlessly matches "X-Ray") and geospatial sorting (Haversine formula).
- **Interactive Live Map:** Integrated Leaflet map rendering dynamic hospital locations with real-time price markers.
- **OTP Authentication:** Secure phone-number-based login system utilizing One-Time Passwords (OTP) and JWT session management.
- **Dynamic Appointment Slots:** Real-time generation and fetching of hospital appointment slots directly from the PostgreSQL database.
- **Secure Payment Gateway:** Complete end-to-end Razorpay integration including backend order creation, frontend checkout modal, and secure backend webhook/signature verification.
- **Medical Report Generation:** Dynamic, downloadable PDF medical reports tied to confirmed booking reference numbers.
- **Modern UI/UX:** A bespoke "Medical Light" aesthetic featuring glassmorphism, centralized hero layouts, and smooth micro-animations.
- **One-Click Deployment:** fully containerized architecture with a custom `render.yaml` blueprint for instant cloud provisioning.

---

## 📂 Project Architecture

```text
mediq/
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/        # Reusable UI (HospitalCard, MapPanel, etc.)
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── pages/             # Route views (Search, Results, Booking, History)
│   │   ├── services/          # API abstractions (api.js)
│   │   └── index.css          # Global "Medical Light" design tokens
│   └── Dockerfile             # Multi-stage Nginx build
│
├── backend/                   # Go REST API
│   ├── cmd/server/main.go     # Application entry point
│   ├── internal/
│   │   ├── database/db.go     # Postgres/GORM connection & seeding
│   │   ├── handlers/          # Gin route controllers
│   │   ├── middleware/        # JWT Auth, CORS, Logging
│   │   └── models/            # Database schemas
│   ├── Dockerfile             # Multi-stage Alpine Go build
│   └── schema.sql             # Fallback raw SQL schemas
│
├── docker-compose.yml         # Local full-stack orchestration
└── render.yaml                # Infrastructure-as-Code for Render deployment
```

---

## ⚙️ Running Locally

### 1. Using Docker (Recommended)
Launch the entire stack (PostgreSQL, Go API, React Frontend) with a single command:
```bash
docker-compose up --build
```
- **Frontend:** http://localhost (Proxied via Nginx)
- **Backend API:** http://localhost:8080

### 2. Manual Setup
If you prefer running services individually for development:

**Backend:**
```bash
cd backend
export DATABASE_URL="postgresql://user:password@host:port/dbname"
go run cmd/server/main.go
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📝 Resume Bullet Points

If you are using this project for your portfolio, here are some suggested resume bullet points:

> *Architected and developed a full-stack diagnostic booking platform using Go (Gin), React, and PostgreSQL, containerized via Docker and deployed on Render/Vercel.*
>
> *Engineered an end-to-end payment pipeline using Razorpay, including secure order creation and HMAC-SHA256 signature verification in Go.*
>
> *Designed a geospatial hospital search engine implementing the Haversine formula and integrated an interactive Leaflet.js map for real-time price comparisons.*
>
> *Built a secure authentication system utilizing OTPs and JWTs, coupled with a dynamic PDF medical report generation engine.*
