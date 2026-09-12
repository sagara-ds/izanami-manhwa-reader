import {
  cloudAddFavorite,
  cloudGetFavorites,
  cloudGetHistory,
  cloudRemoveFavorite,
  cloudSaveHistory,
  isCloudAvailable,
} from "./cloud";
import { getBookmarks, getHistory, setBookmarks, type HistoryEntry } from "./storage";
import { getMangaDetail } from "./shngm";

export async function syncBookmarkToCloud(mangaId: string, saved: boolean): Promise<void> {
  if (!(await isCloudAvailable())) return;
  try {
    if (saved) {
      const detail = await getMangaDetail(mangaId);
      await cloudAddFavorite(
        mangaId,
        detail?.title ?? "",
        detail?.cover_image_url || detail?.cover_portrait_url || "",
      );
    } else {
      await cloudRemoveFavorite(mangaId);
    }
  } catch {}
}

export async function syncHistoryToCloud(entry: HistoryEntry): Promise<void> {
  if (!(await isCloudAvailable())) return;
  try {
    if (entry.chapter_id) await cloudSaveHistory(entry.manga_id, entry.chapter_id, 1);
  } catch {}
}

export async function pullCloudBookmarks(): Promise<string[] | null> {
  if (!(await isCloudAvailable())) return null;
  try {
    const rows = await cloudGetFavorites();
    const ids = rows.map((r) => r.series_slug).filter(Boolean);
    const local = new Set(getBookmarks());
    for (const id of ids) local.add(id);
    const merged = [...local];
    setBookmarks(merged);
    return merged;
  } catch {
    return null;
  }
}

export async function pullCloudHistory(): Promise<void> {
  if (!(await isCloudAvailable())) return;
  try {
    const rows = await cloudGetHistory();
    const local: Record<string, HistoryEntry> = {};
    try {
      const raw = localStorage.getItem("izanami_history");
      Object.assign(local, raw ? JSON.parse(raw) : {});
    } catch {}
    const details = await Promise.all(
      rows.slice(0, 20).map(async (r) => {
        if (local[r.series_slug]) return null;
        const d = await getMangaDetail(r.series_slug);
        if (!d) return null;
        return {
          manga_id: r.series_slug,
          cover: d.cover_image_url || d.cover_portrait_url || "",
          title: d.title,
          chapter_number: d.latest_chapter_number ?? null,
          chapter_id: r.chapter_id,
          ts: Date.now(),
        } satisfies HistoryEntry;
      }),
    );
    for (const d of details) {
      if (d) local[d.manga_id] = d;
    }
    try {
      localStorage.setItem("izanami_history", JSON.stringify(local));
    } catch {}
  } catch {}
}

export function getHistorySnapshot(): HistoryEntry[] {
  return getHistory();
}
