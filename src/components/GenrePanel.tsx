import Link from "next/link";
import type { GenreItem } from "@/lib/shngm-types";
import { safeGenreItems } from "@/lib/format";

export function GenrePanel({ genres, limit = 22 }: { genres: GenreItem[]; limit?: number }) {
  const safe = safeGenreItems(genres).slice(0, limit);
  return (
    <div className="bg-[#141417] rounded-2xl border border-zinc-800/60 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-zinc-800/60 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-[#3b82f6] text-xs">◉</span>
          <h3 className="font-bold text-xs text-white">Genre</h3>
        </div>
        <Link
          href="/genres"
          className="text-[10px] font-semibold text-zinc-500 hover:text-[#3b82f6] transition-colors"
        >
          Semua →
        </Link>
      </div>
      <div className="flex flex-wrap gap-1.5 p-3">
        {safe.length === 0 ? (
          <p className="text-[11px] text-zinc-600">Belum ada genre.</p>
        ) : (
          <>
            {safe.map((g) => (
              <Link
                key={g.slug}
                href={`/explore?genre=${encodeURIComponent(g.slug)}`}
                className="px-2 py-1 text-[10px] font-medium bg-zinc-800/60 hover:bg-[#3b82f6]/15 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 text-zinc-400 border border-zinc-700/40 rounded-lg transition-all"
              >
                {g.name}
              </Link>
            ))}
            <Link
              href="/genres"
              className="px-2 py-1 text-[10px] font-bold bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/25 rounded-lg hover:bg-[#3b82f6] hover:text-white transition-all"
            >
              Semua →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
