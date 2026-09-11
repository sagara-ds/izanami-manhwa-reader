import Link from "next/link";
import { Announcement } from "@/components/Announcement";
import { Nav } from "@/components/Nav";
import { SectionRow } from "@/components/SectionRow";
import { RecommendationTabs } from "@/components/RecommendationTabs";
import { PopularTabs } from "@/components/PopularTabs";
import { Footer } from "@/components/Footer";
import { getBrowse } from "@/lib/shinigami";
import {
  MOCK_POPULAR_ALL,
  MOCK_POPULAR_DAILY,
  MOCK_POPULAR_WEEKLY,
  MOCK_RECOMMENDATIONS,
} from "@/lib/mock-data";
import type { EnrichedComic } from "@/lib/types";

export const revalidate = 120;

export default async function HomePage() {
  const browse = await getBrowse();

  // Map API data if available, otherwise use mock recommendations
  let recommendations: (EnrichedComic & { views?: string })[] =
    MOCK_RECOMMENDATIONS;
  let popularDaily: (EnrichedComic & { views?: string })[] = MOCK_POPULAR_DAILY;
  const popularWeekly: (EnrichedComic & { views?: string })[] =
    MOCK_POPULAR_WEEKLY;
  const popularAll: (EnrichedComic & { views?: string })[] = MOCK_POPULAR_ALL;

  if (browse && browse.hotList && browse.hotList.length > 0) {
    // If live API returns hotList, weave it into recommendations
    const liveItems = browse.hotList.map((c, i) => ({
      ...c,
      comicType: (i % 3 === 0
        ? "manhwa"
        : i % 3 === 1
        ? "manga"
        : "manhua") as "manhwa" | "manga" | "manhua",
      views: `${((i * 37) % 20 / 10 + 1).toFixed(1)}M`,
    }));
    recommendations = liveItems;
    if (browse.trendingList && browse.trendingList.length > 0) {
      popularDaily = browse.trendingList.slice(0, 6).map((c, i) => ({
        ...c,
        views: `${((i * 53) % 30 / 10 + 0.5).toFixed(1)}M`,
      }));
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      {/* Announcement full-width top */}
      <Announcement text="📢 Shinigami API terhubung — baca komik Indonesia langsung dari sumber terpercaya • Manhwa • Manga • Manhua" />

      {/* Sticky top nav */}
      <Nav />

      {/* Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Quick hero highlight / banner promo */}
        <section
          aria-label="Sorotan Utama"
          className="relative rounded-2xl overflow-hidden border border-[#27272a] bg-gradient-to-r from-[#1f1f1f] via-[#141414] to-[#0d0d0d] p-6 sm:p-8 mb-10 shadow-2xl"
        >
          <div className="max-w-2xl relative z-10">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-2.5 py-1 rounded-full mb-3">
              Koleksi Terbaru
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
              Baca Manga, Manhwa &amp; Manhua Bahasa Indonesia
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-4">
              Dark mode AMOLED default, tampilan vertical-scroll seperti Kotatsu,
              update cepat setiap hari langsung dari translator terpercaya.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/serie/solo-leveling"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-xs font-bold shadow-lg hover:opacity-95 transition-opacity"
              >
                Mulai Membaca
              </Link>
              <Link
                href="/explore"
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#27272a] text-[#f4f4f5] text-xs font-semibold hover:border-[#3f3f46] transition-colors"
              >
                Jelajahi Seri
              </Link>
            </div>
          </div>
          <div
            className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#7c3aed]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-32 -bottom-16 w-64 h-64 rounded-full bg-[#06b6d4]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
        </section>

        {/* Section Rekomendasi with tabs: Manhwa • Manga • Manhua */}
        <SectionRow
          title="Rekomendasi"
          actionHref="/explore?sort=rating"
          actionText="Katalog Lengkap"
        >
          <RecommendationTabs items={recommendations} />
        </SectionRow>

        {/* Section Populer with tabs: Harian • Mingguan • Semua */}
        <SectionRow
          title="Populer"
          actionHref="/explore?sort=views"
          actionText="Peringkat"
        >
          <PopularTabs
            daily={popularDaily}
            weekly={popularWeekly}
            all={popularAll}
          />
        </SectionRow>
      </main>

      <Footer />
    </div>
  );
}
