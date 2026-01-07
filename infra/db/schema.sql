-- ================================
-- TicketForge AI - Database Schema
-- ================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- USERS (Authentication & Roles)
-- ================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('ADMIN', 'USER')) DEFAULT 'USER',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- EVENTS (Created & Managed by Admin)
-- ================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  total_seats INT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  status TEXT CHECK (status IN ('DRAFT', 'LIVE', 'CANCELLED')) DEFAULT 'DRAFT',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- SEATS (Seat Map & Locking)
-- ================================
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  section TEXT,
  price NUMERIC(10,2),
  is_locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,
  UNIQUE (event_id, seat_number)
);

-- ================================
-- BOOKINGS (User Purchases)
-- ================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2),
  status TEXT CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- BOOKING_SEATS (Many-to-Many)
-- ================================
CREATE TABLE booking_seats (
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id UUID REFERENCES seats(id),
  PRIMARY KEY (booking_id, seat_id)
);

-- ================================
-- PAYMENTS (Payment Gateway Abstraction)
-- ================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  provider TEXT,
  amount NUMERIC(10,2),
  status TEXT CHECK (status IN ('SUCCESS', 'FAILED', 'REFUNDED')),
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- REFRESH TOKENS (JWT Rotation)
-- ================================
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- INDEXES (Performance Optimization)
-- ================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_seats_event ON seats(event_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ================================
-- SEAT LOCKING (Advisory Lock Example)
-- ================================
-- Example usage in transaction:
-- SELECT pg_advisory_xact_lock(hashtext(seat_id::text));
