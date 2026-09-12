"use client";

import { useState } from "react";
import Link from "next/link";
import type { MangaFormat, MangaItem } from "@/lib/shngm-types";
import { Rail } from "./CardSlider";

const TABS: { id: MangaFormat; label: string }[] = [
  { id: "manhwa", label: "Manhwa" },
  { id: "manga", label: "Manga" },
  { id: "manhua", label: "Manhua" },
];

export function RecommendationTabs({
  byFormat,
  initial = "manhwa",
}: {
  byFormat: Record<MangaFormat, MangaItem[]>;
  initial?: MangaFormat;
}) {
  const [active, setActive] = useState<MangaFormat>(initial);

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
                  ? "bg-[#3b82f6]/20 text-[#bfdbfe] border border-[#3b82f6]/50 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                  : "bg-[#141417] text-[#a1a1aa] border border-zinc-800 hover:text-white hover:border-zinc-600"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <Rail items={byFormat[active] ?? []} />

      <div className="mt-3 flex justify-end">
        <Link
          href={`/recommended?format=${active}`}
          className="text-[11px] font-semibold text-zinc-500 hover:text-[#3b82f6] transition-colors whitespace-nowrap"
        >
          Lihat semua {TABS.find((t) => t.id === active)?.label} ›
        </Link>
      </div>
    </div>
  );
}
