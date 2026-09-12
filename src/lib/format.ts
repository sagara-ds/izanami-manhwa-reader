import type { GenreItem, MangaItem } from "./shngm-types";

const BANNED_GENRES = ["adult", "ecchi", "smut", "hentai", "erotica"];
const JUNK_GENRES = ["dra", "dra-genre"];

export function isSafeGenre(g: { slug?: string; name?: string }): boolean {
  const s = (g.slug ?? "").toLowerCase().trim();
  const n = (g.name ?? "").toLowerCase().trim();
  if (!s && !n) return false;
  if (JUNK_GENRES.includes(s) || JUNK_GENRES.includes(n)) return false;
  return !BANNED_GENRES.some((b) => s.includes(b) || n.includes(b));
}

export function safeGenres<T extends { slug?: string; name?: string }>(list: T[]): T[] {
  return (list ?? []).filter(isSafeGenre);
}

export function safeGenreItems(list: GenreItem[]): GenreItem[] {
  return safeGenres(list);
}

export interface NormalizedManga {
  id: string;
  title: string;
  altTitle: string;
  cover: string;
  portrait: string;
  country: string;
  rating: number | null;
  views: number;
  bookmarks: number;
  year: string;
  status?: number;
  format: string;
  genres: { slug: string; name: string }[];
  chapterNumber: number | null;
  chapterId: string | null;
  chapterTime: string;
  chapters: { chapter_id: string; chapter_number: number; created_at: string }[];
}

export function normalizeManga(m: MangaItem): NormalizedManga {
  return {
    id: m?.manga_id,
    title: m?.title ?? "",
    altTitle: m?.alternative_title ?? "",
    cover: m?.cover_image_url || m?.cover_portrait_url || "",
    portrait: m?.cover_portrait_url || m?.cover_image_url || "",
    country: m?.country_id ?? "",
    rating: m?.user_rate ?? null,
    views: m?.view_count ?? 0,
    bookmarks: m?.bookmark_count ?? 0,
    year: m?.release_year ?? "",
    status: m?.status,
    format: m?.taxonomy?.Format?.[0]?.name ?? "",
    genres: m?.taxonomy?.Genre ?? [],
    chapterNumber: m?.latest_chapter_number ?? null,
    chapterId: m?.latest_chapter_id ?? null,
    chapterTime: m?.latest_chapter_time ?? "",
    chapters: [],
  };
}

export function formatCount(n?: number): string {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function countryFlag(code?: string): string {
  if (!code) return "";
  const c = code.toUpperCase();
  const map: Record<string, string> = { EN: "GB" };
  return map[c] ?? c;
}

export function timeAgoShort(dateString: string): string {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const mo = Math.floor(d / 30);
  if (m < 1) return "baru";
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}j`;
  if (d < 30) return `${d}h`;
  if (mo < 12) return `${mo}bln`;
  return `${Math.floor(mo / 12)}thn`;
}

export function isRecent(dateString: string, days = 3): boolean {
  if (!dateString) return false;
  return Date.now() - new Date(dateString).getTime() < days * 86_400_000;
}

export function timeAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d <= 0) return "Hari ini";
  if (d === 1) return "Kemarin";
  if (d < 30) return `${d} hari lalu`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} bulan lalu`;
  return `${Math.floor(m / 12)} tahun lalu`;
}
