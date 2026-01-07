import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import "./config/db.js";
import { authLimiter } from "./modules/auth/middlewares/rateLimit.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

// Application-wide rate limiting (optional) or just on specific routes
// app.use(authLimiter); 

app.get("/health", (_, res) => {
    res.json({ status: "API running" });
});

import authRoutes from "./modules/auth/auth.routes.js";
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
});
