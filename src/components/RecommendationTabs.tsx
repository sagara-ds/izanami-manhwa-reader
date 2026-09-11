"use client";

import { useMemo, useState } from "react";
import type { ComicType, EnrichedComic } from "@/lib/types";
import { ComicGrid } from "./ComicGrid";

const TABS: { id: ComicType; label: string }[] = [
  { id: "manhwa", label: "Manhwa" },
  { id: "manga", label: "Manga" },
  { id: "manhua", label: "Manhua" },
];

export function RecommendationTabs({
  items,
}: {
  items: (EnrichedComic & { views?: string })[];
}) {
  const [active, setActive] = useState<ComicType>("manhwa");

  const filtered = useMemo(() => {
    return items.filter((it) => it.comicType === active);
  }, [items, active]);

  return (
    <div>
      <div role="tablist" aria-label="Kategori Rekomendasi" className="flex items-center gap-2 mb-4">
        {TABS.map((t) => {
          const isSelected = active === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActive(t.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#7c3aed]/20 text-[#ddd6fe] border border-[#7c3aed]/50 shadow-[0_0_12px_rgba(124,58,237,0.25)]"
                  : "bg-[#1a1a1a] text-[#a1a1aa] border border-[#27272a] hover:text-[#f4f4f5] hover:border-[#3f3f46]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <ComicGrid comics={filtered} />
    </div>
  );
}
