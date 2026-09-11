import type {
  BrowseModel,
  ChapterDetailModel,
  ComicDetailInfo,
  ComicFullModel,
  ComicModel,
  ComicType,
  EnrichedComic,
} from "./types";

const API_BASE = (
  process.env.SHINIGAMI_API_BASE ?? "https://api.shinigami.ae/"
).replace(/\/?$/, "/");

const SITE_BASE = (
  process.env.SHINIGAMI_SITE_BASE ?? "https://shinigamiscans.com"
).replace(/\/+$/, "");

const MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";

async function apiGet<T>(path: string, revalidate = 180): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "User-Agent": MOBILE_UA, Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getBrowse(): Promise<BrowseModel | null> {
  return apiGet<BrowseModel>("api/v1/browse", 120);
}

export type FilterKind = "latest" | "trending" | "rating" | "views" | "new" | "az";

export async function getFilter(
  kind: FilterKind,
  page = 1,
): Promise<ComicModel[] | null> {
  return apiGet<ComicModel[]>(
    `api/v1/filter/${kind}?page=${page}&multiple=false`,
    300,
  );
}

export async function searchComics(
  keyword: string,
  page = 1,
): Promise<ComicModel[] | null> {
  if (!keyword.trim()) return [];
  return apiGet<ComicModel[]>(
    `api/v1/search?keyword=${encodeURIComponent(keyword)}&page=${page}`,
    60,
  );
}

export async function getComicFull(url: string): Promise<ComicFullModel | null> {
  return apiGet<ComicFullModel>(
    `api/v1/comic/full?url=${encodeURIComponent(url)}`,
    600,
  );
}

export async function getChapterImages(url: string): Promise<string[]> {
  const data = await apiGet<ChapterDetailModel>(
    `api/v1/chapter?url=${encodeURIComponent(url)}`,
    600,
  );
  return data?.imageList ?? [];
}

export function lastSegment(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export function seriesHref(url: string): string {
  return `/serie/${lastSegment(url)}`;
}

export function chapterHref(series: string, chapterUrl: string): string {
  return `/read/${series}/${lastSegment(chapterUrl)}`;
}

export function seriesApiUrl(slug: string): string {
  return `${SITE_BASE}/series/${slug}/`;
}

export function chapterApiUrl(slug: string, chapter: string): string {
  return `${SITE_BASE}/series/${slug}/chapter/${chapter}/`;
}

const TYPE_RE = /manhwa|manga|manhua/i;

export function detectType(
  detailList?: ComicDetailInfo[],
): ComicType | undefined {
  if (!detailList) return undefined;
  for (const d of detailList) {
    const m = d.value.match(TYPE_RE);
    if (m) return m[0].toLowerCase() as ComicType;
  }
  return undefined;
}

export async function enrichWithType(
  comics: ComicModel[],
  limit = 18,
): Promise<EnrichedComic[]> {
  const slice = comics.slice(0, limit);
  const settled = await Promise.allSettled(
    slice.map(async (c): Promise<EnrichedComic> => {
      const full = await getComicFull(c.url);
      return { ...c, comicType: detectType(full?.comicDetailModel.detailList) };
    }),
  );
  return settled.map((r, i) =>
    r.status === "fulfilled" ? r.value : { ...slice[i] },
  );
}
