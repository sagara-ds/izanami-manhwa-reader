export interface HistoryEntry {
  manga_id: string;
  cover: string;
  title: string;
  chapter_number: number | null;
  chapter_id: string | null;
  ts: number;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getBookmarks(): string[] {
  const v = read<string[]>("izanami_bookmarks", []);
  return Array.isArray(v) ? v : [];
}

export function setBookmarks(ids: string[]): void {
  write("izanami_bookmarks", ids);
}

export function toggleBookmark(mangaId: string): boolean {
  const bm = getBookmarks();
  const saved = bm.includes(mangaId);
  setBookmarks(saved ? bm.filter((b) => b !== mangaId) : [...bm, mangaId]);
  return !saved;
}

export function getHistory(): HistoryEntry[] {
  const h = read<Record<string, HistoryEntry>>("izanami_history", {});
  return Object.values(h).sort((a, b) => (b?.ts || 0) - (a?.ts || 0));
}

export function saveHistory(entry: HistoryEntry): void {
  const h = read<Record<string, HistoryEntry>>("izanami_history", {});
  h[entry.manga_id] = entry;
  write("izanami_history", h);
}

export function removeHistory(mangaId: string): void {
  const h = read<Record<string, HistoryEntry>>("izanami_history", {});
  delete h[mangaId];
  write("izanami_history", h);
}

export function clearHistory(): void {
  write("izanami_history", {});
}

export function getReadMap(): Record<string, number> {
  return read<Record<string, number>>("izanami_read_chapters", {});
}

export function markChapterRead(chapterId: string, mangaId?: string): void {
  const h = getReadMap();
  h[chapterId] = Date.now();
  write("izanami_read_chapters", h);
  if (mangaId) {
    try {
      localStorage.setItem(`izanami_last_read_${mangaId}`, chapterId);
    } catch {}
  }
}

export function getLastRead(mangaId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`izanami_last_read_${mangaId}`);
  } catch {
    return null;
  }
}

export function getLocalStats(): { bookmarks: number; history: number; read: number } {
  return {
    bookmarks: getBookmarks().length,
    history: getHistory().length,
    read: Object.keys(getReadMap()).length,
  };
}

export function wipeLocalData(): void {
  if (typeof window === "undefined") return;
  ["izanami_bookmarks", "izanami_history", "izanami_read_chapters"].forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("izanami_last_read_"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}
