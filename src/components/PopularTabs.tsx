"use client";

import { useState } from "react";
import type { MangaItem, TopFilter } from "@/lib/shngm-types";
import { Rail } from "./CardSlider";

const TABS: { id: TopFilter; label: string }[] = [
  { id: "daily", label: "Harian" },
  { id: "weekly", label: "Mingguan" },
  { id: "all_time", label: "Semua" },
];

export function PopularTabs({
  byFilter,
}: {
  byFilter: Record<TopFilter, MangaItem[]>;
}) {
  const [filter, setFilter] = useState<TopFilter>("daily");

  return (
    <div>
      <div role="tablist" aria-label="Waktu Populer" className="flex items-center gap-2 mb-4">
        {TABS.map((t) => {
          const isSelected = filter === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setFilter(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#3b82f6]/20 text-[#bfdbfe] border border-[#3b82f6]/50 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                  : "bg-[#141417] text-[#a1a1aa] border border-zinc-800 hover:text-white hover:border-zinc-600"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <Rail items={byFilter[filter] ?? []} rank />
    </div>
  );
}
