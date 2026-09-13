"use client";

import { useEffect, useState } from "react";
import type { GenreItem, HomeManga, MangaFormat } from "@/lib/shngm-types";
import { Rail } from "./CardSlider";
import { HomeUpdates } from "./HomeUpdates";
import { RecommendationTabs } from "./RecommendationTabs";
import { SectionHead } from "./SectionHead";
import { BoltIcon, CheckIcon, StarIcon, ThumbsUpIcon } from "./icons";

interface HomeData {
  recommendations: Record<MangaFormat, HomeManga[]>;
  completed: HomeManga[];
  updates: Record<"all" | MangaFormat, HomeManga[]>;
  genres: GenreItem[];
}

const CACHE_KEY = "izanami-home-v1";
const CACHE_TTL = 5 * 60 * 1000;

function readCache(): HomeData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw) as { ts: number; data: HomeData };
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function RailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-2.5 overflow-hidden pb-1" aria-hidden="true">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[124px] sm:w-[140px] md:w-[156px] aspect-[2/3] rounded-xl bg-[#141417] border border-zinc-800/60 animate-pulse"
          />
        ))}
    </div>
  );
}

function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5"
      aria-hidden="true"
    >
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] rounded-xl bg-[#141417] border border-zinc-800/60 animate-pulse"
          />
        ))}
    </div>
  );
}

function TabsSkeleton() {
  return (
    <div className="flex items-center gap-2 mb-4" aria-hidden="true">
      {["w-20", "w-16", "w-20"].map((w, i) => (
        <div key={i} className={`${w} h-8 rounded-full bg-[#141417] border border-zinc-800/60 animate-pulse`} />
      ))}
    </div>
  );
}

export function HomeSectionsClient({
  top,
  sidebar,
}: {
  top: HomeManga[];
  sidebar: React.ReactNode;
}) {
  // Cache dibaca sekali saat init (bukan di effect) agar lolos aturan purity.
  const [data, setData] = useState<HomeData | null>(() => readCache());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/homepage");
        if (!res.ok) throw new Error(`homepage api ${res.status}`);
        const json = (await res.json()) as HomeData;
        if (cancelled) return;
        setData(json);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: json }));
        } catch {}
      } catch {
        /* offline / API mati: biarkan cache (kalau ada) atau skeleton */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section>
        <SectionHead title="Rekomendasi" Icon={ThumbsUpIcon} iconClass="text-[#3b82f6]" />
        {!data ? (
          <>
            <TabsSkeleton />
            <RailSkeleton />
          </>
        ) : (
          <RecommendationTabs byFormat={data.recommendations} initial="manhwa" />
        )}
      </section>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full">
          <SectionHead title="Update Terbaru" href="/updates" Icon={BoltIcon} iconClass="text-[#3b82f6]" />
          {!data ? <GridSkeleton /> : <HomeUpdates byFormat={data.updates} />}
        </div>
        {sidebar}
      </div>

      <section>
        <SectionHead title="Rating Tertinggi" href="/top" Icon={StarIcon} iconClass="text-yellow-400" />
        <Rail items={top} rank />
      </section>

      <section>
        <SectionHead title="Komik Tamat" href="/completed" Icon={CheckIcon} iconClass="text-emerald-400" />
        {!data ? <RailSkeleton /> : <Rail items={data.completed} />}
      </section>
    </>
  );
}
