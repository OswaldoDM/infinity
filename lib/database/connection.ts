import pg from "pg";

/* 
 * For production (e.g., Vercel, Railway, Render):
 * Use the DATABASE_URL provided by your hosting service
*/

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined. Please add it to your .env.local file"
  );
}

export const pool = new pg.Pool({
  connectionString,
  // Optional: SSL configuration for production databases
  ssl: process.env.NEXT_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false,
});

// Test connection on startup (optional, useful for debugging)
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error with PostgreSQL database", err);
  process.exit(-1);
});

/*
Test users in database:
admin / admin@gmail.com / 123456
John / johndoe@gmail.com / 123456
*/