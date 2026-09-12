import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButtonCorner } from "@/components/ButtonCorner";
import { ComicGrid } from "@/components/ComicGrid";
import { Pagination } from "@/components/Pagination";
import { CheckIcon, FireIcon, StarIcon, CompassIcon, TagIcon } from "@/components/icons";
import { getCompleted, getExplore, getPopular, getRecommended, getUpdates } from "@/lib/shngm";

export const revalidate = 180;

type BrowseKind = "popular" | "top" | "completed" | "updates" | "recommended";

const CONFIG: Record<
  BrowseKind,
  { title: string; subtitle: string; Icon: typeof FireIcon; iconClass: string; hasFormat?: boolean }
> = {
  popular: { title: "Terpopuler", subtitle: "Judul dengan pembaca terbanyak", Icon: FireIcon, iconClass: "text-orange-400" },
  top: { title: "Rating Tertinggi", subtitle: "Peringkat berdasarkan penilaian pembaca", Icon: StarIcon, iconClass: "text-yellow-400" },
  completed: { title: "Komik Tamat", subtitle: "Seri yang sudah selesai — bisa dibaca sampai habis", Icon: CheckIcon, iconClass: "text-emerald-400" },
  updates: { title: "Update Terbaru", subtitle: "Chapter yang baru saja rilis", Icon: CompassIcon, iconClass: "text-[#3b82f6]", hasFormat: true },
  recommended: { title: "Rekomendasi", subtitle: "Pilihan kurasi untuk kamu", Icon: TagIcon, iconClass: "text-[#3b82f6]", hasFormat: true },
};

const FORMATS = [
  { label: "Semua", value: "all" },
  { label: "Manhwa", value: "manhwa" },
  { label: "Manga", value: "manga" },
  { label: "Manhua", value: "manhua" },
];

const PAGE_SIZE = 30;

export async function BrowseView({
  kind,
  page,
  format,
  basePath,
}: {
  kind: BrowseKind;
  page: number;
  format: string;
  basePath: string;
}) {
  const cfg = CONFIG[kind];
  const { Icon } = cfg;

  let items: Awaited<ReturnType<typeof getPopular>>["items"] = [];
  let total: number | undefined;
  let totalPages: number | undefined;

  if (kind === "popular") {
    const res = await getPopular(page, PAGE_SIZE);
    items = res.items;
    total = res.meta?.total_record;
    totalPages = res.meta?.total_page;
  } else if (kind === "top") {
    const res = await getExplore({ page, pageSize: PAGE_SIZE, sort: "rating", sortOrder: "desc" });
    items = res.items;
    total = res.meta?.total_record;
    totalPages = res.meta?.total_page;
  } else if (kind === "completed") {
    const res = await getCompleted(page, PAGE_SIZE);
    items = res.items;
    total = res.meta?.total_record;
    totalPages = res.meta?.total_page;
  } else if (kind === "updates") {
    const res = await getUpdates("project", page, PAGE_SIZE, format === "all" ? undefined : (format as "manhwa" | "manga" | "manhua"));
    items = res.items;
    total = res.meta?.total_record;
    totalPages = res.meta?.total_page;
  } else if (kind === "recommended") {
    const fmt = format === "all" ? undefined : (format as "manhwa" | "manga" | "manhua");
    const res = await getRecommended(fmt, page, PAGE_SIZE);
    items = res.items;
    total = res.meta?.total_record;
    totalPages = res.meta?.total_page;
  }

  function href(p: number, f = format): string {
    const qs = new URLSearchParams({ page: String(p) });
    if (cfg.hasFormat && f !== "all") qs.set("format", f);
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  }

  return (
    <div className="bg-[#09090b] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-5 flex-1 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-1 h-9 bg-[#3b82f6] rounded-full flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${cfg.iconClass}`} />
                <h1 className="text-lg sm:text-xl font-black tracking-tight truncate">{cfg.title}</h1>
                {total != null && (
                  <span className="px-2 py-0.5 bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/25 rounded-lg text-[10px] font-bold flex-shrink-0">
                    {total.toLocaleString("id-ID")}
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-[11px] sm:text-xs mt-0.5 truncate">{cfg.subtitle}</p>
            </div>
          </div>

          {cfg.hasFormat && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {FORMATS.map((f) => (
                <Link
                  key={f.value}
                  href={href(1, f.value)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap ${
                    format === f.value
                      ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                      : "bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:text-white"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <p className="py-24 text-center text-sm text-zinc-500">Tidak ada judul di halaman ini</p>
        ) : (
          <ComicGrid comics={items} />
        )}

        {items.length > 0 && (
          <Pagination page={page} totalPages={totalPages} makeHref={(p) => href(p)} />
        )}
      </main>
      <ButtonCorner />
      <Footer />
    </div>
  );
}
