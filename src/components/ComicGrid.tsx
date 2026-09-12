import type { MangaItem } from "@/lib/shngm-types";
import { ComicCard } from "./ComicCard";

export function ComicGrid({
  comics,
  priorityCount = 6,
}: {
  comics: MangaItem[];
  priorityCount?: number;
}) {
  if (!comics.length) {
    return (
      <div className="py-12 text-center text-xs text-[#71717a]">
        Tidak ada komik ditemukan.
      </div>
    );
  }

  return (
    <div
      role="list"
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5"
    >
      {comics.map((c, i) => (
        <ComicCard key={c.manga_id || i} comic={c} priority={i < priorityCount} />
      ))}
    </div>
  );
}
