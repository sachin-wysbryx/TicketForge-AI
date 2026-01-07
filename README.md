# 🎴 TicketForge AI

An AI-powered distributed event ticketing and live experience platform designed for high-traffic, fraud-resistant, real-time events with dynamic personalization.

---

## 🚀 Tech Stack

### Frontend (`apps/web`)
- **Next.js 15 (App Router)**: The core React framework for building our premium user interface.
- **TypeScript**: Ensures type safety and improves developer experience.
- **Vanilla CSS**: Used for maximum control over styling, enabling the high-fidelity, premium dark-mode aesthetics without the constraints of utility frameworks.
- **Inter (Google Fonts)**: Professional typography for a modern, sleek tech feel.

### Backend (`apps/api`)
- **Node.js (ESM)**: Modern JavaScript runtime with full поддержку (support) for ES Modules.
- **Express**: Fast and minimalist web framework for the REST API.
- **PostgreSQL**: The primary relational database for storing users, tickets, and event data.
- **JWT (JSON Web Tokens)**: Secure stateless authentication using Access and Refresh tokens.
- **Bcrypt**: Industry-standard password hashing for maximum security.
- **tsx**: Modern TypeScript execution engine for rapid development and ESM compatibility.

### Monorepo & Tooling
- **Turborepo**: Manages the multi-package workspace for efficient building and task orchestration.
- **npm Workspaces**: Handles dependency management across the backend and frontend seamlessly.

---

## 📂 Project Structure

### `apps/api` (Backend)
- `src/server.ts`: The main entry point. Configures Express, CORS, and standard middlewares.
- `src/config/`:
  - `db.ts`: PostgreSQL connection logic using the `pg` pool.
  - `jwt.ts`: Centralized configuration for token secrets and expiration.
- `src/modules/auth/`:
  - `auth.routes.ts`: Defines authentication endpoints (`/register`, `/login`).
  - `auth.service.ts`: Contains core business logic (DB queries, hashing, token signing).
  - `auth.utils.ts`: Helper functions for generating JWTs.
  - `middlewares/`: Security logic like rate limiting and token verification.

### `apps/web` (Frontend)
- `src/app/layout.tsx`: Root layout defining fonts and global metadata.
- `src/app/page.tsx`: Landing page logic (currently handles the initial user redirect).
- `src/app/(auth)/`: Auth group for shared styling and layouts.
  - `layout.tsx`: Split-screen premium layout with branding side-panel.
  - `auth.css`: Centralized vanilla CSS for all auth-related components.
  - `login/page.tsx`: Dynamic login form with real-time feedback.
  - `register/page.tsx`: Dynamic registration form including field validation.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** instance running locally or in the cloud.

### 2. Environment Setup
Create a `.env` file in `apps/api/`:
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/ticketforge
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migration
Ensure your database has the `users` table:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'USER'
);
```

### 5. Start Development
From the root directory:
```bash
# Start Backend
npm run dev -w @ticketforge/api

# Start Frontend
cd apps/web && npx next dev
```

---

## 🛡️ Security Features
- **Rate Limiting**: Protects against brute-force attacks on the login endpoint.
- **CORS**: Strictly controlled access for frontend-to-backend communication.
- **Secure Hashing**: Multi-round Bcrypt salting/hashing for all passwords.
- **Distributed Ledger Ready**: Architecture prepared for AI-driven fraud detection and authenticity verification.
