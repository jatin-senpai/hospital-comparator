# MediQ — Diagnostic Hospital Booking Platform

> Find, compare, and book diagnostic tests at top-rated hospitals near you.

![MediQ](https://img.shields.io/badge/Stack-Go%20%7C%20React%20%7C%20PostgreSQL-0ea5e9?style=flat-square&labelColor=0f172a)
![Status](https://img.shields.io/badge/Status-Production%20Ready-2DD4A0?style=flat-square&labelColor=0f172a)

---

## 🚀 Overview

**MediQ** is a production-ready, full-stack web application designed to optimize the patient experience when booking diagnostic medical tests (e.g., X-Rays, MRI Scans, Blood Tests). The platform empowers users to seamlessly search for tests, compare real-time prices and availability across nearby hospitals, and complete bookings through a highly secure, integrated payment gateway. 

Built with scalability and modern user experience in mind, MediQ leverages a robust Go backend, a dynamic React frontend, and a containerized deployment architecture.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Core:** React 18 + Vite (optimized for fast HMR and optimized production builds)
- **Design System:** Custom CSS Modules implementing a bespoke "Medical Light" UI with glassmorphism, micro-animations, and centralized hero layouts.
- **Geospatial Visualization:** Leaflet.js integrating OpenStreetMap API for interactive map rendering.
- **Payment Integration:** Razorpay Frontend SDK for seamless checkout modals.

### Backend Architecture
- **Language:** Go (Golang) 1.21+ 
- **Web Framework:** Gin Web Framework (high-performance HTTP routing)
- **Database:** PostgreSQL (hosted on Render)
- **ORM:** GORM for schema migrations and complex relational querying.
- **Authentication:** Secure Email & Password-based flow coupled with JWT (JSON Web Tokens) for stateless session management.
- **Security:** HMAC-SHA256 Signature Validation for Razorpay webhook verification.

### DevOps & Infrastructure
- **Containerization:** Docker & Docker Compose (Multi-stage builds for optimized image sizes).
- **Web Server / Reverse Proxy:** Nginx (Alpine-based) for serving static frontend assets.
- **Infrastructure-as-Code:** Custom `render.yaml` Blueprints for automated, one-click cloud provisioning.
- **Hosting:** Render (Backend API & PostgreSQL) and Vercel (Frontend edge delivery).

---

## ✨ Core Technical Achievements

- **Geospatial Search Engine:** Implemented a robust backend search algorithm using query normalization (seamlessly matching "x ray" to "X-Ray") and the **Haversine formula** to calculate and sort hospitals by proximity in real-time.
- **Secure Authentication:** Engineered a robust email and password login system, managed via secure JWT (JSON Web Tokens) sessions for stateless authentication.
- **End-to-End Payment Pipeline:** Architected a secure payment flow with Razorpay. Handled backend order creation, frontend state management during checkout, and cryptographic signature verification (HMAC-SHA256) to prevent transaction tampering.
- **Dynamic Medical Report Generation:** Built a customized engine to generate on-the-fly, downloadable PDF medical reports explicitly tied to confirmed booking reference numbers.
- **Optimized Containerization:** Utilized Docker multi-stage builds. Reduced the Go backend image footprint using an `alpine` base and optimized the React SPA delivery using an Nginx reverse proxy.
- **Real-Time Interactive Mapping:** Integrated Leaflet.js to render dynamic hospital locations, plotting dynamic map markers reflecting real-time pricing and availability data fetched from the PostgreSQL database.

---

## 📂 System Architecture

```text
mediq/
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/        # Reusable UI (HospitalCard, MapPanel, etc.)
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── pages/             # Route views (Search, Results, Booking, History)
│   │   ├── services/          # API abstractions (api.js)
│   │   └── index.css          # Global "Medical Light" design tokens
│   └── Dockerfile             # Multi-stage Nginx build (Node builder -> Nginx Alpine)
│
├── backend/                   # Go REST API
│   ├── cmd/server/main.go     # Application entry point
│   ├── internal/
│   │   ├── database/db.go     # Postgres/GORM connection pool & automated seeding
│   │   ├── handlers/          # Gin route controllers (Auth, Bookings, Search)
│   │   ├── middleware/        # JWT Auth Verification, CORS, Request Logging
│   │   └── models/            # Relational database schemas
│   ├── Dockerfile             # Multi-stage build (Golang builder -> Alpine)
│   └── schema.sql             # Fallback raw SQL schemas
│
├── docker-compose.yml         # Local full-stack orchestration
└── render.yaml                # Infrastructure-as-Code for Render cloud deployment
```

---

## ⚙️ Local Development Setup

### 1. Using Docker (Recommended)
Launch the entire integrated stack (PostgreSQL, Go API, Nginx-proxied React Frontend) with a single command:
```bash
docker-compose up --build
```
- **Frontend UI:** `http://localhost` 
- **Backend API:** `http://localhost:8080`

### 2. Manual Setup
For localized module development without containers:

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

## 🤖 Context for AI Assistants (Resume Generation)

*Note: This section is specifically designed to provide context for Large Language Models (like ChatGPT, Claude) to generate high-impact, STAR-method resume bullet points.*

**Project Name:** MediQ
**Role:** Full-Stack Developer
**Key Responsibilities & Impact:**
- Designed and developed a full-stack diagnostic booking platform using Go, React, and PostgreSQL to streamline patient test scheduling.
- Implemented a geospatial search algorithm using the Haversine formula to sort and filter medical facilities by proximity, significantly improving user search accuracy.
- Engineered a secure email and password authentication flow utilizing JWTs, enhancing platform security and user session management.
- Integrated the Razorpay payment gateway, architecting both the frontend checkout experience and the backend cryptographic signature verification (HMAC-SHA256) to ensure secure, tamper-proof transactions.
- Developed a dynamic PDF generation engine to programmatically create and distribute verifiable medical reports to patients post-booking.
- Optimized deployment pipelines by containerizing the application using Docker multi-stage builds (Go Alpine, React Nginx), reducing image sizes and ensuring environment parity across development and production (Render/Vercel).
- Designed a modern, responsive UI implementing a "Medical Light" glassmorphism design system and an interactive Leaflet.js map for real-time price comparisons.
