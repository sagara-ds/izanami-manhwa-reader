import Link from "next/link";
import type { AnyManga } from "@/lib/shngm-types";
import { normalizeManga, formatCount } from "@/lib/format";
import { CountryBadge } from "./CountryBadge";

function rankStyle(i: number): string {
  if (i === 0) return "bg-[#3b82f6] text-white";
  if (i === 1) return "bg-zinc-500 text-white";
  if (i === 2) return "bg-amber-700 text-white";
  return "bg-zinc-800 text-zinc-500";
}

export function ListCard({
  index,
  manga,
  metric = "views",
}: {
  index: number;
  manga: AnyManga;
  metric?: "views" | "rating";
}) {
  const m = normalizeManga(manga);
  return (
    <Link
      href={`/serie/${m.id}`}
      className="group flex items-center gap-2.5 px-3 py-2.5 border-b border-zinc-800/40 hover:bg-[#3b82f6]/5 transition-all duration-200 last:border-b-0"
    >
      <span className={`w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-black flex-shrink-0 ${rankStyle(index)}`}>
        {index + 1}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={(m.cover || "").split("?")[0]}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-9 h-12 rounded-md object-cover flex-shrink-0 bg-zinc-900"
      />
      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
        <p className="text-white text-[11px] font-semibold line-clamp-2 leading-snug group-hover:text-[#3b82f6] transition-colors">
          {m.title}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 leading-none">
          {m.chapterNumber != null && (
            <span className="text-[#3b82f6] font-bold">Ch {m.chapterNumber}</span>
          )}
          {metric === "rating" ? (
            m.rating != null && (
              <span className="flex items-center gap-0.5 font-bold text-yellow-400">
                <span aria-hidden="true">★</span>
                {m.rating}
              </span>
            )
          ) : (
            m.views > 0 && <span>{formatCount(m.views)}</span>
          )}
          <CountryBadge code={m.country} />
        </div>
      </div>
    </Link>
  );
}
