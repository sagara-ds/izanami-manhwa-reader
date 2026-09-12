"use client";

import { useState } from "react";
import type { MangaFormat, MangaItem } from "@/lib/shngm-types";
import { ComicGrid } from "./ComicGrid";
import { UpdateRow } from "./UpdateRow";

const FORMATS: { label: string; value: "all" | MangaFormat }[] = [
  { label: "Semua", value: "all" },
  { label: "Manhwa", value: "manhwa" },
  { label: "Manga", value: "manga" },
  { label: "Manhua", value: "manhua" },
];

export function HomeUpdates({
  byFormat,
}: {
  byFormat: Record<"all" | MangaFormat, MangaItem[]>;
}) {
  const [format, setFormat] = useState<"all" | MangaFormat>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const items = byFormat[format] ?? [];

  return (
    <div>
      <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
              format === f.value
                ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-md shadow-[#3b82f6]/20"
                : "bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:text-white hover:border-zinc-600"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="flex items-center gap-0.5 bg-zinc-800/60 border border-zinc-700/40 rounded-lg p-0.5 ml-auto flex-shrink-0">
          <button
            onClick={() => setView("grid")}
            aria-label="Tampilan grid"
            className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] transition-all cursor-pointer ${
              view === "grid" ? "bg-[#3b82f6] text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            ▦
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="Tampilan daftar"
            className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] transition-all cursor-pointer ${
              view === "list" ? "bg-[#3b82f6] text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <ComicGrid comics={items} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {items.map((m) => (
            <UpdateRow key={m.manga_id} manga={m} />
          ))}
        </div>
      )}
    </div>
  );
}
