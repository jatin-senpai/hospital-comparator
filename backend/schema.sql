-- MediQ PostgreSQL Schema
-- Run with: psql -d mediq -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(200) UNIQUE NOT NULL,
  password    VARCHAR(200) NOT NULL,
  name        VARCHAR(200) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Hospitals table
CREATE TABLE hospitals (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  tagline     VARCHAR(300),
  address     TEXT NOT NULL,
  latitude    DECIMAL(10, 8) NOT NULL,
  longitude   DECIMAL(11, 8) NOT NULL,
  rating      DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  badge       VARCHAR(100),
  badge_color VARCHAR(50),
  phone       VARCHAR(20),
  open_hours  VARCHAR(100),
  established INT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Service prices per hospital
CREATE TABLE service_prices (
  id           SERIAL PRIMARY KEY,
  hospital_id  INT REFERENCES hospitals(id) ON DELETE CASCADE,
  service_id   VARCHAR(50) NOT NULL,   -- 'xray', 'mri', 'blood', etc.
  service_name VARCHAR(100) NOT NULL,
  price        DECIMAL(10, 2) NOT NULL,
  duration_min INT NOT NULL,
  report_time  VARCHAR(50),
  available    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(hospital_id, service_id)
);

-- Time slots
CREATE TABLE time_slots (
  id          SERIAL PRIMARY KEY,
  hospital_id INT REFERENCES hospitals(id) ON DELETE CASCADE,
  service_id  VARCHAR(50),
  slot_time   TIMESTAMP NOT NULL,
  available   BOOLEAN DEFAULT TRUE,
  booked_at   TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id              SERIAL PRIMARY KEY,
  user_id         INT REFERENCES users(id),
  booking_ref     VARCHAR(50) UNIQUE NOT NULL,
  hospital_id     INT REFERENCES hospitals(id),
  slot_id         INT REFERENCES time_slots(id),
  service_id      VARCHAR(50) NOT NULL,
  patient_name    VARCHAR(200) NOT NULL,
  patient_age     INT NOT NULL,
  patient_phone   VARCHAR(20) NOT NULL,
  patient_email   VARCHAR(200),
  patient_gender  VARCHAR(20),
  notes           TEXT,
  amount          DECIMAL(10, 2) NOT NULL,
  payment_method  VARCHAR(50),
  payment_status  VARCHAR(50) DEFAULT 'pending',  -- pending, paid, failed, refunded
  payment_id      VARCHAR(200),                    -- Razorpay payment ID
  status          VARCHAR(50) DEFAULT 'pending',   -- pending, confirmed, cancelled, completed
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);
CREATE INDEX idx_bookings_phone ON bookings(patient_phone);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_service_prices_hospital ON service_prices(hospital_id);
CREATE INDEX idx_hospitals_location ON hospitals(latitude, longitude);
CREATE INDEX idx_slots_hospital_service ON time_slots(hospital_id, service_id);
CREATE INDEX idx_slots_time ON time_slots(slot_time);

-- Seed data
INSERT INTO users (email, password, name) VALUES
('test@mediq.com', 'password123', 'Test User');

INSERT INTO hospitals (name, tagline, address, latitude, longitude, rating, review_count, badge, badge_color, phone, open_hours, established) VALUES
('Apollo Diagnostics', 'Precision. Speed. Care.', 'Sector 12, Jaipur', 26.9220, 75.8110, 4.8, 2341, 'NABH Accredited', 'teal', '+91 98100 12345', '6:00 AM – 10:00 PM', 2008),
('Fortis Health Hub', 'Excellence in Every Test.', 'Malviya Nagar, Jaipur', 26.8994, 75.8069, 4.6, 1892, 'ISO Certified', 'amber', '+91 98200 56789', '7:00 AM – 9:00 PM', 2012),
('Max LifeCare Center', 'Advanced. Affordable. Accessible.', 'C-Scheme, Jaipur', 26.9165, 75.7920, 4.5, 987, 'CAP Certified', 'chalk', '+91 98300 11223', '8:00 AM – 8:00 PM', 2016),
('Medanta Diagnostics', 'Where Science Meets Compassion.', 'Vaishali Nagar, Jaipur', 26.9289, 75.7594, 4.9, 3102, 'NABL Accredited', 'teal', '+91 98400 77889', '5:30 AM – 11:00 PM', 2005);

-- Service prices for Hospital 1 (Apollo)
INSERT INTO service_prices (hospital_id, service_id, service_name, price, duration_min, report_time, available) VALUES
(1, 'xray', 'X-Ray', 350, 15, '2 hrs', true),
(1, 'mri', 'MRI Scan', 4500, 45, '24 hrs', true),
(1, 'ct', 'CT Scan', 3200, 30, '6 hrs', true),
(1, 'blood', 'Blood Test', 180, 10, '6 hrs', true),
(1, 'ecg', 'ECG', 250, 20, '1 hr', true),
(1, 'ultrasound', 'Ultrasound', 800, 25, '2 hrs', true),
(1, 'thyroid', 'Thyroid Panel', 650, 10, '12 hrs', true);

-- Hospitals for Delhi
INSERT INTO hospitals (name, tagline, address, latitude, longitude, rating, review_count, badge, badge_color, phone, open_hours, established) VALUES
('Max Super Speciality', 'World-Class Healthcare', 'Saket, Delhi', 28.5273, 77.2167, 4.7, 4120, 'JCI Accredited', 'teal', '+91 98111 22222', '24 Hours', 2000),
('Dr. Lal PathLabs', 'Trusted Diagnostics', 'Rohini, Delhi', 28.7360, 77.1130, 4.5, 3010, 'NABL Accredited', 'amber', '+91 98222 33333', '6:00 AM – 9:00 PM', 1995);

-- Hospitals for Mumbai
INSERT INTO hospitals (name, tagline, address, latitude, longitude, rating, review_count, badge, badge_color, phone, open_hours, established) VALUES
('Lilavati Hospital', 'More than Healthcare', 'Bandra West, Mumbai', 19.0511, 72.8252, 4.8, 5200, 'NABH Accredited', 'chalk', '+91 98333 44444', '24 Hours', 1997),
('Suburban Diagnostics', 'Precision in Every Drop', 'Andheri West, Mumbai', 19.1363, 72.8277, 4.6, 2150, 'CAP Certified', 'teal', '+91 98444 55555', '7:00 AM – 10:00 PM', 2002);

-- Hospitals for Bangalore
INSERT INTO hospitals (name, tagline, address, latitude, longitude, rating, review_count, badge, badge_color, phone, open_hours, established) VALUES
('Manipal Hospital', 'Life''s On', 'Old Airport Road, Bangalore', 12.9592, 77.6485, 4.9, 6100, 'NABH Accredited', 'amber', '+91 98555 66666', '24 Hours', 1991),
('Anand Diagnostic', 'Quality Uncompromised', 'Shivajinagar, Bangalore', 12.9840, 77.6044, 4.7, 3400, 'NABL Accredited', 'chalk', '+91 98666 77777', '6:30 AM – 8:30 PM', 1974);

-- Hospitals for Hyderabad
INSERT INTO hospitals (name, tagline, address, latitude, longitude, rating, review_count, badge, badge_color, phone, open_hours, established) VALUES
('Apollo Hospitals', 'Touching Lives', 'Jubilee Hills, Hyderabad', 17.4165, 78.4140, 4.8, 4800, 'JCI Accredited', 'teal', '+91 98777 88888', '24 Hours', 1988),
('Lucid Medical Diagnostics', 'Clear Results', 'Banjara Hills, Hyderabad', 17.4156, 78.4385, 4.5, 1200, 'NABL Accredited', 'amber', '+91 98888 99999', '7:00 AM – 9:00 PM', 2005);

-- Hospitals for Pune
INSERT INTO hospitals (name, tagline, address, latitude, longitude, rating, review_count, badge, badge_color, phone, open_hours, established) VALUES
('Ruby Hall Clinic', 'Caring for You', 'Sassoon Road, Pune', 18.5303, 73.8767, 4.7, 3500, 'NABH Accredited', 'chalk', '+91 98999 00000', '24 Hours', 1959),
('Krsnaa Diagnostics', 'Affordable Diagnostics', 'Shivajinagar, Pune', 18.5314, 73.8446, 4.6, 1800, 'ISO Certified', 'teal', '+91 98000 11111', '6:00 AM – 11:00 PM', 2010);

-- Service prices for Delhi (Hospital 5)
INSERT INTO service_prices (hospital_id, service_id, service_name, price, duration_min, report_time, available) VALUES
(5, 'xray', 'X-Ray', 400, 15, '2 hrs', true),
(5, 'mri', 'MRI Scan', 5000, 45, '24 hrs', true),
(5, 'ct', 'CT Scan', 3500, 30, '6 hrs', true),
(5, 'blood', 'Blood Test', 200, 10, '6 hrs', true),
(5, 'ecg', 'ECG', 300, 20, '1 hr', true);

-- Service prices for Mumbai (Hospital 7)
INSERT INTO service_prices (hospital_id, service_id, service_name, price, duration_min, report_time, available) VALUES
(7, 'xray', 'X-Ray', 450, 15, '2 hrs', true),
(7, 'mri', 'MRI Scan', 5500, 45, '24 hrs', true),
(7, 'ct', 'CT Scan', 4000, 30, '6 hrs', true),
(7, 'blood', 'Blood Test', 250, 10, '6 hrs', true),
(7, 'ultrasound', 'Ultrasound', 1000, 25, '2 hrs', true);

-- Service prices for Bangalore (Hospital 9)
INSERT INTO service_prices (hospital_id, service_id, service_name, price, duration_min, report_time, available) VALUES
(9, 'xray', 'X-Ray', 380, 15, '2 hrs', true),
(9, 'mri', 'MRI Scan', 4800, 45, '24 hrs', true),
(9, 'ct', 'CT Scan', 3300, 30, '6 hrs', true),
(9, 'blood', 'Blood Test', 190, 10, '6 hrs', true),
(9, 'thyroid', 'Thyroid Panel', 700, 10, '12 hrs', true);

-- Service prices for Hyderabad (Hospital 11)
INSERT INTO service_prices (hospital_id, service_id, service_name, price, duration_min, report_time, available) VALUES
(11, 'xray', 'X-Ray', 350, 15, '2 hrs', true),
(11, 'mri', 'MRI Scan', 4500, 45, '24 hrs', true),
(11, 'ct', 'CT Scan', 3200, 30, '6 hrs', true),
(11, 'blood', 'Blood Test', 180, 10, '6 hrs', true);

-- Service prices for Pune (Hospital 13)
INSERT INTO service_prices (hospital_id, service_id, service_name, price, duration_min, report_time, available) VALUES
(13, 'xray', 'X-Ray', 320, 15, '2 hrs', true),
(13, 'mri', 'MRI Scan', 4200, 45, '24 hrs', true),
(13, 'ct', 'CT Scan', 3000, 30, '6 hrs', true),
(13, 'blood', 'Blood Test', 160, 10, '6 hrs', true);
