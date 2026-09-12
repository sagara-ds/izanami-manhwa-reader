import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SectionHead } from "@/components/SectionHead";
import { Rail } from "@/components/CardSlider";
import { ListCard } from "@/components/ListCard";
import { HomeUpdates } from "@/components/HomeUpdates";
import { RecommendationTabs } from "@/components/RecommendationTabs";
import { GenrePanel } from "@/components/GenrePanel";
import { ButtonCorner } from "@/components/ButtonCorner";
import { Footer } from "@/components/Footer";
import { BoltIcon, CheckIcon, FireIcon, StarIcon, ThumbsUpIcon } from "@/components/icons";
import {
  getCompleted,
  getGenres,
  getPopular,
  getRecommended,
  getTop,
  getUpdates,
} from "@/lib/shngm";

export const revalidate = 120;

function Panel({ title, href, Icon, iconClass = "text-[#3b82f6]", children }: { title: string; href: string; Icon?: React.ComponentType<{ className?: string }>; iconClass?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141417] rounded-2xl border border-zinc-800/60 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-zinc-800/60 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-3.5 h-3.5 ${iconClass}`} />}
          <h3 className="font-bold text-xs text-white">{title}</h3>
        </div>
        <a href={href} className="text-[10px] font-semibold text-zinc-500 hover:text-[#3b82f6] transition-colors">
          Semua →
        </a>
      </div>
      {children}
    </div>
  );
}

export default async function HomePage() {
  const [recommended, popular, allTime, completed, updAll, updManhwa, updManga, updManhua, genres] =
    await Promise.all([
      getRecommended(undefined, 1, 60),
      getPopular(1, 12),
      getTop("all_time", 12),
      getCompleted(1, 12),
      getUpdates("project", 1, 18),
      getUpdates("project", 1, 18, "manhwa"),
      getUpdates("project", 1, 18, "manga"),
      getUpdates("project", 1, 18, "manhua"),
      getGenres(),
    ]);

  const byFormat = {
    manhwa: recommended.items.filter((m) => m.taxonomy?.Format?.[0]?.slug === "manhwa").slice(0, 12),
    manga: recommended.items.filter((m) => m.taxonomy?.Format?.[0]?.slug === "manga").slice(0, 12),
    manhua: recommended.items.filter((m) => m.taxonomy?.Format?.[0]?.slug === "manhua").slice(0, 12),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-white">
      <Nav />

      <main className="max-w-screen-2xl mx-auto px-3 sm:px-4 pt-4 pb-10 w-full flex-1 flex flex-col gap-4">
        <Hero items={popular.items} />

        <section>
          <SectionHead title="Rekomendasi" Icon={ThumbsUpIcon} iconClass="text-[#3b82f6]" />
          <RecommendationTabs byFormat={byFormat} initial="manhwa" />
        </section>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="flex-1 min-w-0 w-full">
            <SectionHead title="Update Terbaru" href="/updates" Icon={BoltIcon} iconClass="text-[#3b82f6]" />
            <HomeUpdates
              byFormat={{
                all: updAll.items,
                manhwa: updManhwa.items,
                manga: updManga.items,
                manhua: updManhua.items,
              }}
            />
          </div>

          <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
            <Panel title="Terpopuler" href="/popular" Icon={FireIcon} iconClass="text-orange-400">
              {popular.items.slice(0, 10).map((m, i) => (
                <ListCard key={m.manga_id} index={i} manga={m} />
              ))}
            </Panel>
            <Panel title="Rating Tertinggi" href="/top" Icon={StarIcon} iconClass="text-yellow-400">
              {allTime.slice(0, 8).map((m, i) => (
                <ListCard key={m.manga_id} index={i} manga={m} />
              ))}
            </Panel>
            <GenrePanel genres={genres} />
          </aside>
        </div>

        <section>
          <SectionHead title="Rating Tertinggi" href="/top" Icon={StarIcon} iconClass="text-yellow-400" />
          <Rail items={allTime} rank />
        </section>

        <section>
          <SectionHead title="Komik Tamat" href="/completed" Icon={CheckIcon} iconClass="text-emerald-400" />
          <Rail items={completed.items} />
        </section>
      </main>

      <ButtonCorner />
      <Footer />
    </div>
  );
}
