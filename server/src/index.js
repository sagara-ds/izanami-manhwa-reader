import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/v1/auth/login", async (req, res) => {
  const { email } = req.body ?? {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "email required" });
  }
  const { rows } = await db.query(
    `INSERT INTO users (email) VALUES ($1)
     ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
     RETURNING id, email, display_name, created_at`,
    [email.toLowerCase().trim()],
  );
  res.json(rows[0]);
});

app.get("/api/v1/favorites", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const { rows } = await db.query(
    `SELECT series_slug, title, cover, created_at FROM favorites
     WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  res.json(rows);
});

app.post("/api/v1/favorites", async (req, res) => {
  const { userId, seriesSlug, title, cover } = req.body ?? {};
  if (!userId || !seriesSlug) {
    return res.status(400).json({ error: "userId, seriesSlug required" });
  }
  const { rows } = await db.query(
    `INSERT INTO favorites (user_id, series_slug, title, cover)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, series_slug) DO NOTHING
     RETURNING series_slug`,
    [userId, seriesSlug, title ?? "", cover ?? ""],
  );
  res.status(201).json({ added: rows.length > 0 });
});

app.delete("/api/v1/favorites", async (req, res) => {
  const { userId, seriesSlug } = req.body ?? {};
  if (!userId || !seriesSlug) {
    return res.status(400).json({ error: "userId, seriesSlug required" });
  }
  await db.query(
    `DELETE FROM favorites WHERE user_id = $1 AND series_slug = $2`,
    [userId, seriesSlug],
  );
  res.json({ removed: true });
});

app.get("/api/v1/history", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const { rows } = await db.query(
    `SELECT series_slug, chapter_id, page, updated_at FROM history
     WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 50`,
    [userId],
  );
  res.json(rows);
});

app.post("/api/v1/history", async (req, res) => {
  const { userId, seriesSlug, chapterId, page } = req.body ?? {};
  if (!userId || !seriesSlug || !chapterId) {
    return res.status(400).json({ error: "userId, seriesSlug, chapterId required" });
  }
  const { rows } = await db.query(
    `INSERT INTO history (user_id, series_slug, chapter_id, page, updated_at)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (user_id, series_slug)
     DO UPDATE SET chapter_id = EXCLUDED.chapter_id, page = EXCLUDED.page, updated_at = now()
     RETURNING series_slug, chapter_id, page, updated_at`,
    [userId, seriesSlug, chapterId, Number(page ?? 1)],
  );
  res.json(rows[0]);
});

app.use((err, _req, res) => {
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

app.listen(PORT, () => {
  console.log(`izanami-api listening on :${PORT}`);
});
