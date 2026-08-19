# Technical Decisions — MediQ

This document outlines the design, architecture, and tradeoffs made during the development of MediQ.

## 1. Data Ingestion & Fallback Architecture
We implemented a **resilient hybrid data ingestion strategy**:
* **The Architecture**: The React frontend is configured to consume a Go REST API backend backed by PostgreSQL. However, if the database or Go API is unreachable (e.g., in serverless frontend environments like Vercel), the client layer (`api.js`) captures network exceptions and activates a **Local Mock Database Fallback**.
* **Why this over the alternative**: The alternative was a rigid frontend that crashes or displays empty states if the evaluator does not launch the local Go/DB containers. This strategy guarantees 100% runtime uptime for reviewers while preserving full backend capabilities for local execution.

## 2. Technical Trade-offs & Future Scope
* **Geographical Computations**: Due to time constraints, distances between search coordinates and diagnostic centers are calculated using the client-side **Haversine formula**. In a production environment with more development time, we would integrate a routing engine (e.g., OSRM or Mapbox Matrix API) to calculate actual travel time and driving distance.
* **Map Vector Density**: Current Leaflet maps use public Carto CDN tile layers. With a full week, we would implement server-side caching of tiles, marker clustering for dense clinics, and auto-complete address geocoding.

## 3. AI Assistance & Developer Verifications
* **AI Tooling**: Antigravity AI was utilized to draft initial CSS modules, responsive breakpoints, and UI skeletons.
* **Manual Verifications**: 
  * Audited and restructured the coordinate calculations to ensure exact mathematical distance consistency between the homepage preview and the search results view.
  * Refined `fetchWithAuth` error bounds to catch HTML redirection payloads from SPA routing hosts, allowing failovers to trigger correctly.
  * Verified 390px mobile responsiveness manually on Brave viewport simulations.
