# Izanami — Platform Baca Manga / Manhwa / Manhua Indonesia

Content-heavy manga reader, dark-mode default, high density, vertical scroll.
Visual: MangaDex + Bato.to + Komiku + Kurokami. Reader: Kotatsu-style.

## Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4, Inter + DM Sans
- **Data API:** Shinigami (reverse-engineered dari app Android resmi) + mock fallback
- **Backend:** Supabase Postgres + RLS (favorites, history), Auth magic link

## Jalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Env (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

Skema cloud: `supabase/migrations/` (users, favorites, history + RLS).


## Data pribadi (Supabase, RLS per user)

- `users`, `favorites`, `history` — lihat `supabase/migrations/`
- Auth: magic link email, captcha Turnstile di form kirim link

## Desain

Mockup HTML asli tersimpan di `design/` (`izanami-landing.html`, `reader.html`) + spec (`IZANAMI-DESIGN.md`, `READER-DESIGN.md`).
Token: bg `#0d0d0d`, surface `#1a1a1a`, card `#1f1f1f`, accent `#7c3aed`/`#06b6d4`.
