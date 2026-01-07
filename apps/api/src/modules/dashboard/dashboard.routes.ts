import { Router } from "express";
import { db } from "../../config/db.js";
import { authMiddleware, AuthRequest } from "../auth/middlewares/auth.middleware.js";

const router = Router();

// Dashboard Summary
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const userId = req.user.id;
        const { search } = req.query;

        // 1. User Info
        const userRes = await db.query("SELECT full_name, role FROM users WHERE id = $1", [userId]);
        const user = userRes.rows[0];

        // 2. Stats
        const attendedRes = await db.query("SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status = 'CONFIRMED'", [userId]);
        const attendedCount = parseInt(attendedRes.rows[0].count);

        // 3. Next Event
        const nextEventRes = await db.query(`
      SELECT e.* 
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = $1 AND b.status = 'CONFIRMED' AND e.event_date > NOW()
      ORDER BY e.event_date ASC
      LIMIT 1
    `, [userId]);

        // 4. Curated / Search
        let queryParams = [userId];
        let queryStr = `
      SELECT e.*, 
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = $1 AND f.event_id = e.id) as is_favorite
      FROM events e 
      WHERE e.status = 'LIVE' AND e.event_date > NOW()
    `;

        if (search) {
            queryStr += ` AND (title ILIKE $2 OR description ILIKE $2 OR venue ILIKE $2)`;
            queryParams.push(`%${search}%`);
        }

        queryStr += ` ORDER BY event_date ASC LIMIT 6`;
        const recommendedRes = await db.query(queryStr, queryParams);

        // 5. Unread Notifications Count
        const notifRes = await db.query("SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false", [userId]);

        res.json({
            user: { fullName: user.full_name, role: user.role },
            stats: { attended: attendedCount, points: 1250 },
            nextEvent: nextEventRes.rows[0],
            recommendedEvents: recommendedRes.rows,
            unreadNotifications: parseInt(notifRes.rows[0].count)
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// My Tickets
router.get("/my-tickets", authMiddleware, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
        const { rows } = await db.query(`
      SELECT b.id as booking_id, b.status, b.total_amount, b.created_at as booking_date,
             e.title, e.event_date, e.venue
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = $1
      ORDER BY e.event_date DESC
    `, [req.user.id]);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle Favorite
router.post("/favorite/:eventId", authMiddleware, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { eventId } = req.params;
    const userId = req.user.id;

    try {
        const existing = await db.query("SELECT * FROM favorites WHERE user_id = $1 AND event_id = $2", [userId, eventId]);
        if (existing.rows.length > 0) {
            await db.query("DELETE FROM favorites WHERE user_id = $1 AND event_id = $2", [userId, eventId]);
            return res.json({ favorited: false });
        } else {
            await db.query("INSERT INTO favorites (user_id, event_id) VALUES ($1, $2)", [userId, eventId]);
            return res.json({ favorited: true });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get Notifications
router.get("/notifications", authMiddleware, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
        const { rows } = await db.query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10", [req.user.id]);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
