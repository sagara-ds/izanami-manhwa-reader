import type { EnrichedComic } from "@/lib/types";
import { ComicCard } from "./ComicCard";

export function ComicGrid({
  comics,
  priorityCount = 6,
}: {
  comics: (EnrichedComic & { views?: string })[];
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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
    >
      {comics.map((c, i) => (
        <ComicCard key={c.url || i} comic={c} priority={i < priorityCount} />
      ))}
    </div>
  );
}
