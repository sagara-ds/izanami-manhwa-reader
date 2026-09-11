# Izanami — Platform Baca Manga / Manhwa / Manhua Indonesia

Content-heavy manga reader, dark-mode default, high density, vertical scroll.
Visual: MangaDex + Bato.to + Komiku. Reader: Kotatsu-style.

## Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4, Inter + DM Sans
- **Data API:** Shinigami (`https://api.shinigami.ae/`, reverse-engineered dari app Android resmi) + mock fallback
- **Backend:** `server/` Express + PostgreSQL (favorites, history)

## Jalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Env opsional (`.env.local`):

```
SHINIGAMI_API_BASE=https://api.shinigami.ae/
SHINIGAMI_SITE_BASE=https://shinigamiscans.com
```

Backend + DB:

```bash
cp server/.env.example server/.env
docker compose up -d db   # postgres:16 di :5432, schema auto-apply
cd server && npm install && npm run dev   # api di :4000
```

## Routes

| Route | Sumber data |
|---|---|
| `/` landing (Rekomendasi tabs Manhwa/Manga/Manhua, Populer Harian/Mingguan/Semua) | `api/v1/browse` + mock |
| `/serie/[slug]` detail + chapter list + related | `api/v1/comic/full?url=` + mock |
| `/read/[slug]/[chapterId]` reader vertical scroll | `api/v1/chapter?url=` + mock |
| `/explore?sort=trending\|rating\|views\|latest\|new\|az&page=` | `api/v1/filter/{kind}` + mock |
| `/search?q=` | `api/v1/search` + mock |
| `/library` favorit + lanjutkan baca (mock, sinkron API segera) | `server/` |

## API map (dari `wiryaimd/shinigami-android`)

- `GET api/v1/browse` → `{hotList, newsList, trendingList}`
- `GET api/v1/comic/full?url=` → `{comicModel, comicDetailModel}`
- `GET api/v1/chapter?url=` → `{imageList}`
- `GET api/v1/filter/{latest,trending,rating,views,new,az}?page=&multiple=`
- `GET api/v1/search?keyword=&page=`

`ComicModel`: `{title, url, cover, latestChapter, latestChapterUrl, rating}`.
`url` = path seri situs → slug route app.

## Desain

Mockup HTML asli tersimpan di `design/` (`izanami-landing.html`, `reader.html`) + spec (`IZANAMI-DESIGN.md`, `READER-DESIGN.md`).
Token: bg `#0d0d0d`, surface `#1a1a1a`, card `#1f1f1f`, accent `#7c3aed`/`#06b6d4`.
