"use client";
/* eslint-disable react-hooks/set-state-in-effect -- sync persisted explore view once on mount */

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GridIcon, RowsIcon, SearchIcon } from "./icons";

const SORTS = [
  { label: "Terbaru", value: "latest" },
  { label: "Terpopuler", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "A-Z", value: "az" },
];

type View = "grid" | "list";

function applyView(v: View) {
  document.getElementById("explore-grid")?.classList.toggle("hidden", v !== "grid");
  const list = document.getElementById("explore-list");
  list?.classList.toggle("hidden", v !== "list");
  list?.classList.toggle("flex", v === "list");
}

export function ExploreToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [view, setView] = useState<View>("grid");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("izanami-explore-view") === "list") {
        setView("list");
        requestAnimationFrame(() => applyView("list"));
      }
    } catch {}
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function setParam(key: string, value: string) {
    const qs = new URLSearchParams(sp.toString());
    if (!value) qs.delete(key);
    else qs.set(key, value);
    qs.delete("page");
    const s = qs.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }

  function onQuery(v: string) {
    setQ(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setParam("q", v.trim()), 400);
  }

  function changeView(v: View) {
    setView(v);
    try {
      localStorage.setItem("izanami-explore-view", v);
    } catch {}
    applyView(v);
  }

  const sort = sp.get("sort") ?? "latest";
  const desc = (sp.get("order") ?? "desc") === "desc";

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[160px]">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Cari"
          className="w-full pl-10 pr-3 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]/50 border border-transparent"
        />
      </div>

      <div
        role="tablist"
        aria-label="Tampilan"
        className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-transparent"
      >
        <button
          role="tab"
          aria-selected={view === "grid"}
          onClick={() => changeView("grid")}
          aria-label="Tampilan grid"
          className={`w-9 h-9 grid place-items-center rounded-lg transition-all cursor-pointer ${
            view === "grid" ? "bg-[#3b82f6] text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <GridIcon className="w-5 h-5" />
        </button>
        <button
          role="tab"
          aria-selected={view === "list"}
          onClick={() => changeView("list")}
          aria-label="Tampilan list"
          className={`w-9 h-9 grid place-items-center rounded-lg transition-all cursor-pointer ${
            view === "list" ? "bg-[#3b82f6] text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <RowsIcon className="w-5 h-5" />
        </button>
      </div>

      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value === "latest" ? "" : e.target.value)}
        aria-label="Urutkan"
        className="px-4 py-2.5 bg-white/5 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-[#3b82f6]/50 border border-transparent cursor-pointer"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => setParam("order", desc ? "asc" : "")}
        aria-label={desc ? "Urutkan menaik" : "Urutkan menurun"}
        className="w-11 h-11 grid place-items-center rounded-xl bg-white/5 border border-transparent text-zinc-200 hover:bg-white/10 cursor-pointer text-lg"
      >
        {desc ? "↓" : "↑"}
      </button>
    </div>
  );
}
