import Link from "next/link";

function pages(current: number, total?: number): (number | "...")[] {
  if (total == null) return [current, current + 1];
  if (total <= 1) return [1];
  const set = new Set<number>([1, total]);
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) set.add(i);
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "...")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("...");
    out.push(p);
  });
  return out;
}

export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages?: number;
  makeHref: (p: number) => string;
}) {
  const list = pages(page, totalPages);
  const canPrev = page > 1;
  const canNext = totalPages == null || page < totalPages;
  const btn =
    "w-9 h-9 flex items-center justify-center rounded-xl bg-[#18181b] border border-zinc-700/50 text-zinc-300 text-sm transition-all hover:bg-[#3b82f6] hover:border-[#3b82f6] hover:text-white";
  return (
    <div className="flex justify-center items-center gap-1.5 mt-8 flex-wrap">
      {canPrev ? (
        <Link href={makeHref(page - 1)} className={btn} aria-label="Sebelumnya">←</Link>
      ) : (
        <span className={`${btn} opacity-30 pointer-events-none`}>←</span>
      )}
      {list.map((p, i) =>
        p === "..." ? (
          <span key={`d${i}`} className="w-9 h-9 flex items-center justify-center text-zinc-500 text-sm select-none">…</span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            className={`${btn} font-semibold ${
              p === page ? "bg-[#3b82f6] border-[#3b82f6] text-white shadow-md shadow-[#3b82f6]/20" : ""
            }`}
          >
            {p}
          </Link>
        )
      )}
      {canNext ? (
        <Link href={makeHref(page + 1)} className={btn} aria-label="Berikutnya">→</Link>
      ) : (
        <span className={`${btn} opacity-30 pointer-events-none`}>→</span>
      )}
    </div>
  );
}
