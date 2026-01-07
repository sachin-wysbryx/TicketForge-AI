import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const db = new Pool({
    connectionString: process.env.DATABASE_URL
});

db.on("connect", () => {
    console.log("✅ PostgreSQL connected");
});
