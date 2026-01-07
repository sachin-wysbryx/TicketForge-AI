# 🎴 TicketForge AI

An AI-powered distributed event ticketing and live experience platform designed for high-traffic, fraud-resistant, real-time events with dynamic personalization.

---

## 🚀 Tech Stack

### Frontend (`apps/web`)
- **Next.js 15 (App Router)**: Core React framework for the premium user interface.
- **TypeScript**: Ensures type safety across the application.
- **Vanilla CSS**: Custom styling for high-fidelity, cinematic dark and light mode aesthetics.
- **Inter (Google Fonts)**: Professional typography for a modern tech feel.

### Backend (`apps/api`)
- **Node.js (ESM)**: Modern JavaScript runtime with full ES Modules support.
- **Express**: Fast, minimalist web framework for REST API endpoints.
- **PostgreSQL**: Primary relational database for users, tickets, and events.
- **JWT (JSON Web Tokens)**: Secure stateless authentication with Access/Refresh token rotation.
- **Bcrypt**: Industry-standard password hashing.
- **tsx**: Modern TypeScript execution engine for rapid development.

---

## 📂 Project Structure

### `apps/api` (Backend)
- `src/server.ts`: Entry point. Configures Express, CORS, and API routes.
- `src/config/`:
  - `db.ts`: PostgreSQL pool connection.
  - `setup.ts`: Applies the SQL schema to the database.
  - `seed.ts`: **Master Seed File** containing all test users, events, bookings, and notifications.
- `src/modules/`:
  - `auth/`: JWT-based registration and login logic.
  - `dashboard/`: Dynamic user profile data, search, and notification logic.

### `apps/web` (Frontend)
- `src/app/page.tsx`: Landing page with themed redirect logic.
- `src/app/(auth)/`: Premium split-screen login and registration experience.
- `src/app/dashboard/`: Dynamic user dashboard with live search, favorites, and ticket management.
- `src/app/globals.css`: Root design tokens and font configurations.

---

## 🛠️ Getting Started

### 1. Environment Setup
Create a `.env` file in `apps/api/`:
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/ticketforge
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database & Seeding
Apply the schema and populate the database with test data in one go:
```bash
cd apps/api
npx tsx src/config/setup.ts && npx tsx src/config/seed.ts
```

### 4. Run Development
```bash
# Terminal 1: API
npm run dev -w @ticketforge/api

# Terminal 2: Web
cd apps/web && npx next dev
```

---

## 🔐 Test Account
- **User**: `alex@example.com`
- **Password**: `password123`

---

## 🛡️ Security Features
- **Stateless Auth**: JWT rotation for secure, scalable sessions.
- **Rate Limiting**: Protection against brute-force attacks on login.
- **Anti-Fraud Architecture**: Prepared for AI-driven verification and seat locking.
