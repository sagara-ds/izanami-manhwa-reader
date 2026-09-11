"use client";

import { useState } from "react";
import type { EnrichedComic } from "@/lib/types";
import { ComicGrid } from "./ComicGrid";

type Timeframe = "daily" | "weekly" | "all";

const TABS: { id: Timeframe; label: string }[] = [
  { id: "daily", label: "Harian" },
  { id: "weekly", label: "Mingguan" },
  { id: "all", label: "Semua" },
];

export function PopularTabs({
  daily,
  weekly,
  all,
}: {
  daily: (EnrichedComic & { views?: string })[];
  weekly: (EnrichedComic & { views?: string })[];
  all: (EnrichedComic & { views?: string })[];
}) {
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");

  const activeList =
    timeframe === "daily" ? daily : timeframe === "weekly" ? weekly : all;

  return (
    <div>
      <div role="tablist" aria-label="Waktu Populer" className="flex items-center gap-2 mb-4">
        {TABS.map((t) => {
          const isSelected = timeframe === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setTimeframe(t.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#06b6d4]/20 text-[#a5f3fc] border border-[#06b6d4]/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "bg-[#1a1a1a] text-[#a1a1aa] border border-[#27272a] hover:text-[#f4f4f5] hover:border-[#3f3f46]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <ComicGrid comics={activeList} />
    </div>
  );
}
