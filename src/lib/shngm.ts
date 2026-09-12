import type {
  AnnouncementItem,
  ApiEnvelope,
  ChapterDetail,
  ChapterEntry,
  GenreItem,
  ListType,
  MangaDetail,
  MangaFormat,
  MangaItem,
  PageMeta,
  SliderItem,
  TopFilter,
} from "./shngm-types";

const API_BASE = (
  process.env.SHNGM_API_BASE ?? "https://api.shngm.io/v1/"
).replace(/\/?$/, "/");

const SLIDER_BASE = (
  process.env.SHNGM_SLIDER_BASE ?? "https://slider.shinigami.io/v1/"
).replace(/\/?$/, "/");

const MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";

function headers(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    "User-Agent": MOBILE_UA,
    Accept: "application/json",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function apiGet<T>(
  path: string,
  revalidate = 180,
  token?: string,
): Promise<{ data: T; meta?: PageMeta } | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: headers(token),
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    if (json.retcode !== 0) return null;
    return { data: json.data, meta: json.meta };
  } catch {
    return null;
  }
}

export async function getRecommended(
  format?: MangaFormat,
  page = 1,
  pageSize = 30,
): Promise<{ items: MangaItem[]; meta?: PageMeta }> {
  const qs = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    is_recommended: "true",
    sort: "latest",
    sort_order: "desc",
  });
  if (format) qs.set("format", format);
  const res = await apiGet<MangaItem[]>(`manga/list?${qs}`, 300);
  return { items: res?.data ?? [], meta: res?.meta };
}

export async function getTop(
  filter: TopFilter,
  pageSize = 12,
): Promise<MangaItem[]> {
  const qs = new URLSearchParams({
    filter,
    page: "1",
    page_size: String(pageSize),
  });
  const res = await apiGet<MangaItem[]>(`manga/top?${qs}`, 300);
  return res?.data ?? [];
}

export async function getUpdates(
  type: ListType,
  page = 1,
  pageSize = 24,
  format?: MangaFormat,
): Promise<{ items: MangaItem[]; meta?: PageMeta }> {
  const qs = new URLSearchParams({
    type,
    page: String(page),
    page_size: String(pageSize),
    is_update: "true",
    sort: "latest",
    sort_order: "desc",
  });
  if (format) qs.set("format", format);
  const res = await apiGet<MangaItem[]>(`manga/list?${qs}`, 120);
  return { items: res?.data ?? [], meta: res?.meta };
}

export async function getPopular(
  page = 1,
  pageSize = 24,
): Promise<{ items: MangaItem[]; meta?: PageMeta }> {
  const qs = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    genre_include_mode: "or",
    genre_exclude_mode: "or",
    sort: "popularity",
    sort_order: "desc",
  });
  const res = await apiGet<MangaItem[]>(`manga/list?${qs}`, 300);
  return { items: res?.data ?? [], meta: res?.meta };
}

export async function getCompleted(
  page = 1,
  pageSize = 24,
): Promise<{ items: MangaItem[]; meta?: PageMeta }> {
  const qs = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    genre_include_mode: "or",
    genre_exclude_mode: "or",
    status: "completed",
    sort: "latest",
    sort_order: "desc",
  });
  const res = await apiGet<MangaItem[]>(`manga/list?${qs}`, 300);
  return { items: res?.data ?? [], meta: res?.meta };
}

export async function searchManga(
  q: string,
  page = 1,
): Promise<{ items: MangaItem[]; meta?: PageMeta }> {
  if (!q.trim()) return { items: [] };
  const qs = new URLSearchParams({
    page: String(page),
    page_size: "24",
    q: q.trim(),
  });
  const res = await apiGet<MangaItem[]>(`manga/list?${qs}`, 60);
  return { items: res?.data ?? [], meta: res?.meta };
}

export async function getMangaDetail(
  mangaId: string,
): Promise<MangaDetail | null> {
  const res = await apiGet<MangaDetail>(`manga/detail/${mangaId}`, 600);
  return res?.data ?? null;
}

export async function getChapterDetail(
  chapterId: string,
): Promise<ChapterDetail | null> {
  const res = await apiGet<ChapterDetail>(`chapter/detail/${chapterId}`, 600);
  return res?.data ?? null;
}

export function chapterImageUrls(ch: ChapterDetail): string[] {
  const base = ch.base_url.replace(/\/+$/, "");
  const path = ch.chapter.path.startsWith("/")
    ? ch.chapter.path
    : `/${ch.chapter.path}`;
  return ch.chapter.data.map((f) => `${base}${path}${f}`);
}

export async function getChapterList(
  mangaId: string,
  limit = 0,
): Promise<ChapterEntry[]> {
  const detail = await getMangaDetail(mangaId);
  if (detail?.chapters?.length) {
    if (limit > 0) return detail.chapters.slice(0, limit);
    return detail.chapters;
  }
  if (!detail?.latest_chapter_id) return [];
  const out: ChapterEntry[] = [];
  let cursor: string | null = detail.latest_chapter_id;
  let guard = 0;
  const maxIter = limit > 0 ? limit : 500;
  while (cursor && guard < maxIter) {
    guard += 1;
    const ch = await getChapterDetail(cursor);
    if (!ch) break;
    out.push({
      chapter_id: ch.chapter_id,
      chapter_number: ch.chapter_number,
      created_at: ch.release_date,
    });
    cursor = ch.prev_chapter_id;
  }
  return out;
}

export async function getChapterListPaginated(
  mangaId: string,
  page = 1,
  pageSize = 24,
): Promise<{ chapters: ChapterEntry[]; total: number; totalPages: number }> {
  const all = await getChapterList(mangaId);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = all.slice(start, start + pageSize);
  return { chapters: slice, total, totalPages };
}

export async function getSlider(): Promise<SliderItem[]> {
  try {
    const res = await fetch(`${SLIDER_BASE}slider/web`, {
      headers: headers(),
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: SliderItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getAnnouncements(
  pageSize = 10,
): Promise<AnnouncementItem[]> {
  const res = await apiGet<AnnouncementItem[]>(
    `announcement/list?page=1&page_size=${pageSize}`,
    600,
  );
  return res?.data ?? [];
}

export async function getGenres(): Promise<GenreItem[]> {
  const res = await apiGet<GenreItem[]>(`genre/list`, 600);
  return res?.data ?? [];
}

export async function getExplore({
  page = 1,
  pageSize = 24,
  genres = [],
  status = "",
  format = "",
  sort = "latest",
  sortOrder = "desc",
  keyword = "",
  type = "",
  isUpdate = false,
  includeMode = "or",
  excludeMode = "or",
  excludeGenres = [],
  author = "",
}: {
  page?: number;
  pageSize?: number;
  genres?: string[];
  status?: string;
  format?: string;
  sort?: string;
  sortOrder?: string;
  keyword?: string;
  type?: string;
  isUpdate?: boolean;
  includeMode?: "or" | "and";
  excludeMode?: "or" | "and";
  excludeGenres?: string[];
  author?: string;
}): Promise<{ items: MangaItem[]; meta?: PageMeta }> {
  const qs = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  for (const g of genres) qs.append("genre_include", g);
  for (const g of excludeGenres) qs.append("genre_exclude", g);
  if (type) qs.set("type", type);
  if (isUpdate) qs.set("is_update", "true");
  if (status) qs.set("status", status);
  if (format && format !== "all") qs.set("format", format);
  if (author.trim()) qs.set("author", author.trim());
  if (sort) qs.set("sort", sort);
  qs.set("sort_order", sortOrder);
  if (keyword) qs.set("q", keyword);
  qs.set("genre_include_mode", includeMode === "and" ? "and" : "or");
  qs.set("genre_exclude_mode", excludeMode === "and" ? "and" : "or");
  const res = await apiGet<MangaItem[]>(`manga/list?${qs}`, 120);
  return { items: res?.data ?? [], meta: res?.meta };
}

export function formatOf(item: MangaItem): MangaFormat | undefined {
  const slug = item.taxonomy?.Format?.[0]?.slug?.toLowerCase();
  if (slug === "manhwa" || slug === "manga" || slug === "manhua") return slug;
  return undefined;
}

export function genresOf(item: MangaItem): string[] {
  return (item.taxonomy?.Genre ?? []).map((g) => g.name);
}

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
