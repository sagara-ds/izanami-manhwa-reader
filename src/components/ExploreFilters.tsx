"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { GenreItem } from "@/lib/shngm-types";
import { SearchIcon } from "./icons";

const FORMATS = [
  { label: "Semua", value: "all" },
  { label: "Manhwa", value: "manhwa" },
  { label: "Manga", value: "manga" },
  { label: "Manhua", value: "manhua" },
];

const TYPES = [
  { label: "Semua Type", value: "" },
  { label: "Project", value: "project" },
  { label: "Mirror", value: "mirror" },
];

const STATUS = [
  { label: "Semua Status", value: "" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Hiatus", value: "hiatus" },
];

const MODES = [
  { label: "Or", value: "or" },
  { label: "And", value: "and" },
];

type Mode = "or" | "and";

function splitList(v: string | string[] | null): string[] {
  const raw = Array.isArray(v) ? v : v ? [v] : [];
  return raw
    .flatMap((g) => g.split(","))
    .map((g) => g.trim())
    .filter(Boolean)
    .filter((g, i, a) => a.indexOf(g) === i);
}

function buildQs(args: {
  keyword: string;
  genres: string[];
  excludeGenres: string[];
  includeMode: Mode;
  excludeMode: Mode;
  format: string;
  type: string;
  status: string;
  author: string;
  sort: string;
  order: string;
  page: number;
}): string {
  const qs = new URLSearchParams();
  const q = args.keyword.trim();
  if (q) qs.set("q", q);
  for (const g of args.genres) qs.append("genre", g);
  for (const g of args.excludeGenres) qs.append("xgenre", g);
  if (args.includeMode !== "or") qs.set("inc", args.includeMode);
  if (args.excludeMode !== "or") qs.set("exc", args.excludeMode);
  if (args.format && args.format !== "all") qs.set("format", args.format);
  if (args.type) qs.set("type", args.type);
  if (args.status) qs.set("status", args.status);
  if (args.author.trim()) qs.set("author", args.author.trim());
  if (args.sort && args.sort !== "latest") qs.set("sort", args.sort);
  if (args.order && args.order !== "desc") qs.set("order", args.order);
  if (args.page > 1) qs.set("page", String(args.page));
  return qs.toString();
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center justify-between py-2 text-left cursor-pointer"
      >
        <span className="text-lg font-extrabold text-white tracking-tight">{title}</span>
        <span aria-hidden="true" className="text-zinc-400 text-sm">
          {open ? "︿" : "﹀"}
        </span>
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

export function ExploreFilters({ genres, children }: { genres: GenreItem[]; children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initialGenres = splitList(sp.getAll("genre"));
  const initialExclude = splitList(sp.getAll("xgenre"));

  const [format, setFormat] = useState(sp.get("format") ?? "all");
  const [type, setType] = useState(sp.get("type") ?? "");
  const [status, setStatus] = useState(sp.get("status") ?? "");
  const [author, setAuthor] = useState(sp.get("author") ?? "");
  const [includeMode, setIncludeMode] = useState<Mode>(sp.get("inc") === "and" ? "and" : "or");
  const [excludeMode, setExcludeMode] = useState<Mode>(sp.get("exc") === "and" ? "and" : "or");
  const [selected, setSelected] = useState<string[]>(initialGenres);
  const [excluded, setExcluded] = useState<string[]>(initialExclude);
  const [addMode, setAddMode] = useState<"include" | "exclude">("include");
  const [showGenres, setShowGenres] = useState(initialGenres.length > 0 || initialExclude.length > 0);
  const [genreQuery, setGenreQuery] = useState("");
  const [genreOpen, setGenreOpen] = useState(true);
  const [openFormat, setOpenFormat] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openAuthor, setOpenAuthor] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  type Next = {
    genres: string[];
    excludeGenres: string[];
    includeMode: Mode;
    excludeMode: Mode;
    format: string;
    type: string;
    status: string;
    author: string;
  };

  function base(): Next & { keyword: string; sort: string; order: string } {
    return {
      keyword: sp.get("q") ?? "",
      genres: selected,
      excludeGenres: excluded,
      includeMode,
      excludeMode,
      format,
      type,
      status,
      author,
      sort: sp.get("sort") ?? "latest",
      order: sp.get("order") ?? "desc",
    };
  }

  function push(next: Next) {
    const s = buildQs({ ...base(), ...next, page: 1 });
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }

  function toggleGenre(slug: string) {
    if (addMode === "include") {
      const list = selected.includes(slug)
        ? selected.filter((g) => g !== slug)
        : [...selected, slug];
      setSelected(list);
      push({ ...base(), genres: list });
    } else {
      const list = excluded.includes(slug)
        ? excluded.filter((g) => g !== slug)
        : [...excluded, slug];
      setExcluded(list);
      push({ ...base(), excludeGenres: list });
    }
  }

  function update(patch: Partial<Next>) {
    const next = { ...base(), ...patch };
    if (patch.format !== undefined) setFormat(patch.format);
    if (patch.type !== undefined) setType(patch.type);
    if (patch.status !== undefined) setStatus(patch.status);
    if (patch.includeMode !== undefined) setIncludeMode(patch.includeMode);
    if (patch.excludeMode !== undefined) setExcludeMode(patch.excludeMode);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    push(next);
  }

  function onAuthor(v: string) {
    setAuthor(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      push({ ...base(), author: v });
    }, 500);
  }

  function clearAll() {
    setFormat("all");
    setType("");
    setStatus("");
    setAuthor("");
    setIncludeMode("or");
    setExcludeMode("or");
    setSelected([]);
    setExcluded([]);
    setGenreQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.replace(pathname, { scroll: false });
  }

  const hasFilters =
    (sp.get("q") ?? "") ||
    format !== "all" ||
    type !== "" ||
    status !== "" ||
    author.trim() ||
    selected.length > 0 ||
    excluded.length > 0;

  const gq = genreQuery.trim().toLowerCase();
  const visibleGenres = gq
    ? genres.filter(
        (g) => g.name.toLowerCase().includes(gq) || g.slug.toLowerCase().includes(gq)
      )
    : genres;

  const genreGrid = (
    <>
      <div className="relative mb-3">
        <input
          type="text"
          value={genreQuery}
          onChange={(e) => setGenreQuery(e.target.value)}
          placeholder="Search Genre"
          className="w-full pl-4 pr-10 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]/50 border border-transparent"
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setAddMode("include")}
          className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            addMode === "include"
              ? "bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30"
              : "bg-white/5 text-zinc-400 border-transparent hover:text-white"
          }`}
        >
          Include{selected.length > 0 ? ` (${selected.length})` : ""}
        </button>
        <button
          onClick={() => setAddMode("exclude")}
          className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            addMode === "exclude"
              ? "bg-red-500/15 text-red-400 border-red-500/30"
              : "bg-white/5 text-zinc-400 border-transparent hover:text-white"
          }`}
        >
          Exclude{excluded.length > 0 ? ` (${excluded.length})` : ""}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2">
        {visibleGenres.map((g) => {
          const inc = selected.includes(g.slug);
          const exc = excluded.includes(g.slug);
          return (
            <button
              key={g.slug}
              onClick={() => toggleGenre(g.slug)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-center truncate ${
                inc
                  ? "bg-[#3b82f6] text-white"
                  : exc
                    ? "bg-red-600/80 text-white line-through"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {g.name}
            </button>
          );
        })}
      </div>
      {visibleGenres.length === 0 && (
        <p className="py-6 text-center text-xs text-zinc-600">Genre tidak ditemukan</p>
      )}
    </>
  );

  const modeSelects = (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-zinc-200">Inclusion mode</label>
        <select
          value={includeMode}
          onChange={(e) => update({ includeMode: e.target.value as Mode })}
          className="w-full px-4 py-2.5 bg-white/5 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-[#3b82f6]/50 border border-transparent cursor-pointer"
        >
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-zinc-200">Exclusion mode</label>
        <select
          value={excludeMode}
          onChange={(e) => update({ excludeMode: e.target.value as Mode })}
          className="w-full px-4 py-2.5 bg-white/5 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-[#3b82f6]/50 border border-transparent cursor-pointer"
        >
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  const collapsibles = (
    <>
      <Section title="Format" open={openFormat} onToggle={() => setOpenFormat((p) => !p)}>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => update({ format: f.value })}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                format === f.value
                  ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                  : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Type" open={openType} onToggle={() => setOpenType((p) => !p)}>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => update({ type: t.value })}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                type === t.value
                  ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                  : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Status" open={openStatus} onToggle={() => setOpenStatus((p) => !p)}>
        <div className="flex flex-wrap gap-2">
          {STATUS.map((s) => (
            <button
              key={s.value}
              onClick={() => update({ status: s.value })}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                status === s.value
                  ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                  : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Author" open={openAuthor} onToggle={() => setOpenAuthor((p) => !p)}>
        <input
          type="text"
          value={author}
          onChange={(e) => onAuthor(e.target.value)}
          placeholder="Nama author… misal: hyenim-author"
          className="w-full px-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]/50 border border-transparent"
        />
      </Section>
    </>
  );

  const panelBody = (
    <div className="rounded-2xl bg-black border border-white/5 p-4 sm:p-5 flex flex-col gap-4">
      <Section title="Genre" open={genreOpen} onToggle={() => setGenreOpen((p) => !p)}>
        {genreGrid}
      </Section>
      {modeSelects}
      {collapsibles}
    </div>
  );

  return (
    <>
      <div className="lg:hidden sticky top-[60px] z-30 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 flex items-center gap-2">
        <button
          onClick={() => setShowGenres((p) => !p)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            selected.length > 0 || excluded.length > 0
              ? "bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30"
              : "bg-[#18181b] text-zinc-400 border-zinc-700/40 hover:text-white"
          }`}
        >
          <span className="sm:inline">Genre</span>
          {selected.length + excluded.length > 0 && (
            <span className="font-black">({selected.length + excluded.length})</span>
          )}
          <span aria-hidden="true" className="text-[10px]">{showGenres ? "▴" : "▾"}</span>
        </button>
        {hasFilters ? (
          <button
            onClick={clearAll}
            title="Reset semua filter"
            className="p-2 rounded-xl text-zinc-400 hover:text-[#3b82f6] bg-zinc-800/50 border border-zinc-700/40 hover:border-[#3b82f6]/30 transition-all cursor-pointer"
          >
            ✕
          </button>
        ) : null}
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start mt-0 lg:mt-4">
        <aside className="hidden lg:block w-72 xl:w-[300px] flex-shrink-0 self-start sticky top-[76px] max-h-[calc(100dvh-92px)] overflow-y-auto">
          {panelBody}
        </aside>
        <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
          {showGenres && (
            <div className="lg:hidden max-h-[70vh] overflow-y-auto">{panelBody}</div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
