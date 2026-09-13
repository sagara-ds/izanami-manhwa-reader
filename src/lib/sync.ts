import {
  cloudAddFavorite,
  cloudGetFavorites,
  cloudGetHistory,
  cloudRemoveFavorite,
  cloudSaveHistory,
  isCloudAvailable,
} from "./cloud";
import { getBookmarks, getHistory, setBookmarks, type HistoryEntry } from "./storage";
import { getChapterDetail, getMangaDetail } from "./shngm";

export interface SyncResult {
  bookmarks: number;
  history: number;
  errors: string[];
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function readLocalHistory(): Record<string, HistoryEntry> {
  try {
    const raw = localStorage.getItem("izanami_history");
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalHistory(h: Record<string, HistoryEntry>): void {
  try {
    localStorage.setItem("izanami_history", JSON.stringify(h));
  } catch {}
}

/**
 * Full bidirectional sync. Returns null when logged out.
 * - Bookmarks: upload local-only ids, then merge cloud ids locally.
 * - History: push local rows that are missing or newer in cloud,
 *   pull cloud rows missing locally (chapter number resolved accurately).
 * Errors are collected (never thrown) so callers can surface them.
 */
export async function syncNow(): Promise<SyncResult | null> {
  if (!(await isCloudAvailable())) return null;
  const errors: string[] = [];

  // --- Bookmarks: upload local-only, then merge ---
  let bookmarks: string[] = getBookmarks();
  try {
    const rows = await cloudGetFavorites();
    const cloudIds = new Set(rows.map((r) => r.series_slug).filter(Boolean));
    for (const id of bookmarks) {
      if (cloudIds.has(id)) continue;
      try {
        const d = await getMangaDetail(id);
        await cloudAddFavorite(
          id,
          d?.title ?? "",
          d?.cover_image_url || d?.cover_portrait_url || "",
        );
      } catch (e) {
        errors.push(`bookmark-upload:${id}:${errMsg(e)}`);
      }
    }
    const merged = [...new Set([...bookmarks, ...cloudIds])];
    setBookmarks(merged);
    bookmarks = merged;
  } catch (e) {
    errors.push(`bookmark-pull:${errMsg(e)}`);
  }

  // --- History: push missing-or-newer, pull missing ---
  let historyCount = 0;
  try {
    const rows = await cloudGetHistory();
    const cloudById = new Map(rows.map((r) => [r.series_slug, r]));
    const local = readLocalHistory();

    for (const [mid, entry] of Object.entries(local)) {
      const c = cloudById.get(mid);
      const cloudTs = c ? new Date(c.updated_at).getTime() : 0;
      if (!c || (entry.ts || 0) > cloudTs) {
        if (!entry.chapter_id) continue;
        try {
          await cloudSaveHistory(mid, entry.chapter_id, 1);
        } catch (e) {
          errors.push(`history-upload:${mid}:${errMsg(e)}`);
        }
      }
    }

    const fresh = await cloudGetHistory();
    let resolved = 0;
    for (const r of fresh) {
      if (local[r.series_slug] || resolved >= 20) continue;
      try {
        const [ch, d] = await Promise.all([
          r.chapter_id ? getChapterDetail(r.chapter_id).catch(() => null) : null,
          getMangaDetail(r.series_slug).catch(() => null),
        ]);
        if (!d) continue;
        local[r.series_slug] = {
          manga_id: r.series_slug,
          cover: d.cover_image_url || d.cover_portrait_url || "",
          title: d.title,
          chapter_number: ch?.chapter_number ?? d.latest_chapter_number ?? null,
          chapter_id: r.chapter_id,
          ts: new Date(r.updated_at).getTime() || Date.now(),
        };
        resolved++;
      } catch (e) {
        errors.push(`history-pull:${r.series_slug}:${errMsg(e)}`);
      }
    }
    writeLocalHistory(local);
    historyCount = Object.keys(local).length;
  } catch (e) {
    errors.push(`history:${errMsg(e)}`);
  }

  if (errors.length > 0) {
    console.error("[sync]", errors);
  }
  return { bookmarks: bookmarks.length, history: historyCount, errors };
}

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
