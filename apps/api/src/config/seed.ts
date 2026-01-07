import { db } from "./db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const seed = async () => {
    try {
        console.log("⏳ Running Master Seed...");

        // 1. Clean existing data (Optional, but helps keep it a single source of truth)
        console.log("🧹 Cleaning old data...");
        await db.query("TRUNCATE users, events, bookings, favorites, notifications CASCADE");

        // 2. Create Test User (Alex Morgan)
        const hashedPassword = await bcrypt.hash("password123", 10);
        const userRes = await db.query(`
      INSERT INTO users (email, password, full_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ["alex@example.com", hashedPassword, "Alex Morgan", "USER"]);

        const userId = userRes.rows[0].id;
        console.log("✅ User seeded.");

        // 3. Create Events
        const eventRes = await db.query(`
      INSERT INTO events (title, description, venue, event_date, total_seats, base_price, status, created_by)
      VALUES 
      ('Neon Dreams Festival', 'A neon-themed electronic music festival.', 'The Grand Arena, NYC', '2026-06-08 20:00:00', 5000, 89.00, 'LIVE', $1),
      ('Midnight Saxophone Sessions', 'A soulful night of jazz music.', 'Blue Note Jazz Club, NYC', '2026-10-24 21:00:00', 200, 45.00, 'LIVE', $1),
      ('The Electric Echoes', 'Indie rock vibes in the heart of the city.', 'Madison Square Garden, NYC', '2026-11-02 19:00:00', 15000, 89.00, 'LIVE', $1),
      ('Abstract Dimensions Expo', 'Explore modern art through various lenses.', 'MoMA, NYC', '2026-11-10 10:00:00', 1000, 25.00, 'LIVE', $1)
      RETURNING id, title
    `, [userId]);

        const events = eventRes.rows;
        const neonDreams = events.find(e => e.title === 'Neon Dreams Festival');
        const saxSessions = events.find(e => e.title === 'Midnight Saxophone Sessions');
        console.log("✅ 4 Events seeded.");

        // 4. Create a Confirmed Booking for Alex
        await db.query(`
      INSERT INTO bookings (user_id, event_id, total_amount, status)
      VALUES ($1, $2, $3, $4)
    `, [userId, neonDreams.id, 89.00, 'CONFIRMED']);
        console.log("✅ 1 Booking seeded.");

        // 5. Seed Favorites
        await db.query(`
      INSERT INTO favorites (user_id, event_id)
      VALUES ($1, $2), ($1, $3)
    `, [userId, events[1].id, events[2].id]);
        console.log("✅ Favorites seeded.");

        // 6. Seed Notifications
        await db.query(`
      INSERT INTO notifications (user_id, title, message)
      VALUES 
      ($1, 'Order Confirmed', 'Your tickets for Neon Dreams Festival are now available.'),
      ($1, 'Security Alert', 'New login detected from a Chrome browser on Windows.')
    `, [userId]);
        console.log("✅ Notifications seeded.");

        console.log("🚀 Master Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seed();
