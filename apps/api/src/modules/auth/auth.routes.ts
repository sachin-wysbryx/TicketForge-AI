import { Router } from "express";
import { registerUser, loginUser, User } from "./auth.service.js";
import { db } from "../../config/db.js";
import bcrypt from "bcrypt";
import { authLimiter } from "./middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password, confirmPassword, fullName, role } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ error: "Email, password, and full name are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Note: registerUser implementation uses 'full_name' column.
        // Ensure this column exists in the 'users' table.
        await registerUser(email, password, fullName, role);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/login", authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user: User = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const tokens = await loginUser(user);
        res.json(tokens);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
