import { db } from "./db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const setupDb = async () => {
    try {
        console.log("⏳ Setting up database schema step by step...");
        const schemaPath = path.join(__dirname, "../../../../infra/db/schema.sql");
        const schemaSql = await fs.readFile(schemaPath, "utf-8");

        // Split by semicolon but handle potential issues with newlines
        const statements = schemaSql.split(";").map(s => s.trim()).filter(s => s.length > 0);

        for (const statement of statements) {
            try {
                await db.query(statement);
            } catch (err: any) {
                if (err.message.includes("already exists")) {
                    console.log(`ℹ️ skipping: ${statement.substring(0, 50)}... (already exists)`);
                } else {
                    console.warn(`⚠️ warning on statement: ${statement.substring(0, 50)}...`, err.message);
                }
            }
        }

        console.log("✅ Database schema processing complete.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Schema application failed:", error);
        process.exit(1);
    }
};

setupDb();
