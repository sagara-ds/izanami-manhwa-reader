import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

pool.on("error", (err) => {
  console.error("pg pool error", err);
});

export const db = {
  query: (text, params) => pool.query(text, params),
};
