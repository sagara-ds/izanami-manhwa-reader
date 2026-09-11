# Izanami — Manga Reader Indonesia — Design & API Spec

## Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js (Express / Fastify)
- **DB:** PostgreSQL
- **Data API eksternal:** shinigami.asia (manga/manhwa/manhua Indonesia aggregator)

## Visual System
- Dark native: bg `#0d0d0d`, surface `#1a1a1a`, card `#1f1f1f`
- Accent: `#7c3aed` (violet) + `#06b6d4` (cyan)
- Font: Inter (UI) + DM Sans (heading/display)
- High density, minimal whitespace — content-first
- Card hover: `scale(1.02)` + glow accent shadow

## Referensi Visual
- MangaDex (struktur data & katalog)
- Bato.to (layout dense, filter tab)
- Komiku (UI cepat, minimal)
- shinigami.asia (sumber data manga Indonesia)

## Halaman
- Nav sticky (Home / Explore / Library / Search + avatar dropdown)
- Banner "Pengumuman" full-width shimmer
- Section Rekomendasi: tab Manhwa / Manga / Manhua
- Section Populer: tab Harian / Mingguan / Semua
- Card: cover thumbnail + judul + badge genre + rating/views

## File
- `izanami-landing.html` → desain landing halaman utama (self-contained, verifikasi lokal)
