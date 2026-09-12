import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getGenres } from "@/lib/shngm";
import { safeGenreItems } from "@/lib/format";
import { TagIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Genre — Izanami",
  description: "Jelajahi semua genre manga, manhwa, dan manhua di Izanami.",
};

export const revalidate = 600;

export default async function GenresPage() {
  const genres = safeGenreItems(await getGenres());

  return (
    <div className="bg-[#09090b] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-screen-xl mx-auto px-4 py-5 w-full flex-1">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-1 h-6 bg-[#3b82f6] rounded-full" aria-hidden="true" />
          <TagIcon className="w-4 h-4 text-[#3b82f6]" />
          <h1 className="text-xl font-bold">Daftar Genre</h1>
        </div>
        {genres.length === 0 ? (
          <p className="text-xs text-zinc-600">Daftar genre tidak tersedia saat ini.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {genres.map((g) => (
              <Link
                key={g.slug}
                href={`/explore?genre=${encodeURIComponent(g.slug)}`}
                className="group flex items-center justify-center p-3 sm:p-4 bg-[#18181b] rounded-xl border border-zinc-800/40 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] text-zinc-300 transition-all duration-200 text-center font-medium text-sm"
              >
                {g.name}
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
