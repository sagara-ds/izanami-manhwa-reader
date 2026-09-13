import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ListCard } from "@/components/ListCard";
import { GenrePanel } from "@/components/GenrePanel";
import { HomeSectionsClient } from "@/components/HomeSectionsClient";
import { ButtonCorner } from "@/components/ButtonCorner";
import { Footer } from "@/components/Footer";
import { FireIcon, StarIcon } from "@/components/icons";
import { getGenres, getHomePopular, getHomeTop } from "@/lib/shngm";

export const revalidate = 120;

const SITE_URL = "https://izanami.sagarads-portofolio.my.id";

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
  const [popular, allTime, genres] = await Promise.all([
    getHomePopular(12),
    getHomeTop(12),
    getGenres(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Izanami",
    url: SITE_URL,
    inLanguage: "id",
    mainEntity: {
      "@type": "ItemList",
      name: "Komik Terpopuler",
      itemListElement: popular.slice(0, 8).map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/serie/${m.manga_id}`,
        name: m.title,
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-white">
      <Nav />

      <main className="max-w-screen-2xl mx-auto px-3 sm:px-4 pt-4 pb-10 w-full flex-1 flex flex-col gap-4">
        <Hero items={popular} />

        <HomeSectionsClient
          top={allTime}
          sidebar={
            <aside key="sidebar" className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
              <Panel title="Terpopuler" href="/popular" Icon={FireIcon} iconClass="text-orange-400">
                {popular.slice(0, 10).map((m, i) => (
                  <ListCard key={m.manga_id} index={i} manga={m} />
                ))}
              </Panel>
              <Panel title="Rating Tertinggi" href="/top" Icon={StarIcon} iconClass="text-yellow-400">
                {allTime.slice(0, 8).map((m, i) => (
                  <ListCard key={m.manga_id} index={i} manga={m} metric="rating" />
                ))}
              </Panel>
              <GenrePanel genres={genres} />
            </aside>
          }
        />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ButtonCorner />
      <Footer />
    </div>
  );
}
