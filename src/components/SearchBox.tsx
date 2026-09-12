"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./icons";

interface SuggestItem {
  manga_id: string;
  title: string;
  subtitle: string;
  cover: string;
}

export function SearchBox({
  autoFocus = false,
  placeholder = "Cari judul…",
  className = "",
  onNavigate,
}: {
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const boxRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef(new Map<string, SuggestItem[]>());

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  function runSearch(v: string) {
    const q = v.trim();
    if (q.length < 2) {
      abortRef.current?.abort();
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }
    const hit = cacheRef.current.get(q.toLowerCase());
    if (hit) {
      setResults(hit);
      setOpen(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        const items = (d?.items ?? []) as SuggestItem[];
        cacheRef.current.set(q.toLowerCase(), items);
        setResults(items);
        setHighlight(-1);
      })
      .catch(() => {})
      .finally(() => {
        if (abortRef.current === ctrl) setLoading(false);
      });
  }

  function onChange(v: string) {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(v), 300);
  }

  function goSerie(id: string) {
    setOpen(false);
    onNavigate?.();
    router.push(`/serie/${id}`);
  }

  function goSearch(q: string) {
    const t = q.trim();
    if (!t) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(t)}`);
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        action="/search"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          if (highlight >= 0 && results[highlight]) goSerie(results[highlight].manga_id);
          else goSearch(query);
        }}
      >
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
        <input
          autoFocus={autoFocus}
          type="search"
          name="q"
          role="combobox"
          aria-expanded={open}
          aria-controls="nav-search-listbox"
          aria-activedescendant={highlight >= 0 ? `nav-search-${highlight}` : undefined}
          autoComplete="off"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2 && results.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => (results.length ? (h + 1) % results.length : -1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => (results.length ? (h - 1 + results.length) % results.length : -1));
            } else if (e.key === "Escape") {
              setOpen(false);
              setHighlight(-1);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 bg-[#141417] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]/60 transition-colors"
        />
      </form>

      {open && query.trim().length >= 2 && (
        <div
          id="nav-search-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-[#141417] border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
        >
          {loading && results.length === 0 ? (
            <p className="py-6 text-center text-zinc-500 text-xs">Mencari…</p>
          ) : results.length === 0 ? (
            <p className="py-6 text-center text-zinc-500 text-xs">Tidak ada hasil</p>
          ) : (
            <>
              {results.map((m, i) => (
                <button
                  key={m.manga_id}
                  id={`nav-search-${i}`}
                  role="option"
                  aria-selected={i === highlight}
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => goSerie(m.manga_id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors border border-transparent cursor-pointer ${
                    i === highlight ? "bg-[#3b82f6]/10" : "hover:bg-white/5"
                  } ${i > 0 ? "border-t border-t-zinc-800/60" : ""}`}
                >
                  {m.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.cover}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-10 h-14 rounded-lg object-cover flex-shrink-0 bg-zinc-900"
                    />
                  ) : (
                    <span className="w-10 h-14 rounded-lg bg-zinc-900 flex-shrink-0" />
                  )}
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-white text-sm font-bold line-clamp-1">{m.title}</span>
                    {m.subtitle ? (
                      <span className="text-zinc-400 text-xs mt-0.5 line-clamp-1">{m.subtitle}</span>
                    ) : null}
                  </span>
                </button>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="block px-3 py-2.5 text-center text-[11px] font-bold text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors"
              >
                Lihat semua hasil →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
