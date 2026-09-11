import type {
  ComicDetailModel,
  ComicType,
  EnrichedComic,
} from "./types";

function cover(seed: string): string {
  return `https://picsum.photos/seed/${seed}/300/420`;
}

function page(seed: string, i: number): string {
  return `https://picsum.photos/seed/${seed}-p${i}/800/1200`;
}

function comic(
  title: string,
  slug: string,
  type: ComicType,
  genres: string[],
  rating: number,
  latestChapter: string,
  views: string,
): EnrichedComic & { views: string } {
  return {
    title,
    url: `https://shinigamiscans.com/series/${slug}/`,
    cover: cover(slug),
    latestChapter,
    latestChapterUrl: `https://shinigamiscans.com/series/${slug}/chapter/12/`,
    rating,
    comicType: type,
    genres,
    views,
  };
}

const SOLO = comic("Solo Leveling", "solo-leveling", "manhwa", ["Action", "Fantasy"], 4.9, "Chapter 179", "12.4M");
const TBATE = comic("The Beginning After The End", "tbate", "manhwa", ["Fantasy", "Action"], 4.8, "Chapter 245", "9.8M");
const ORV = comic("Omniscient Reader's Viewpoint", "orv", "manhwa", ["Fantasy", "Apocalypse"], 4.9, "Chapter 210", "8.5M");
const NANO = comic("Nano Machine", "nano-machine", "manhwa", ["Action", "Sci-Fi"], 4.7, "Chapter 258", "6.4M");
const TOG = comic("Tower of God", "tower-of-god", "manhwa", ["Adventure", "Fantasy"], 4.6, "Chapter 612", "11.2M");
const LNB = comic("Legend of the Northern Blade", "northern-blade", "manhwa", ["Action", "Martial Arts"], 4.7, "Chapter 189", "7.2M");
const OP = comic("One Piece", "one-piece", "manga", ["Adventure", "Action"], 4.9, "Chapter 1120", "25.1M");
const JJK = comic("Jujutsu Kaisen", "jujutsu-kaisen", "manga", ["Action", "Supernatural"], 4.7, "Chapter 271", "14.6M");
const BERSERK = comic("Berserk", "berserk", "manga", ["Dark Fantasy", "Horror"], 4.9, "Chapter 375", "9.1M");
const BTTH = comic("Battle Through the Heavens", "btth", "manhua", ["Action", "Cultivation"], 4.5, "Chapter 428", "7.8M");
const APOTHEOSIS = comic("Apotheosis", "apotheosis", "manhua", ["Action", "Cultivation"], 4.4, "Chapter 1150", "6.9M");
const MARTIAL_PEAK = comic("Martial Peak", "martial-peak", "manhua", ["Action", "Cultivation"], 4.5, "Chapter 3620", "8.3M");

export const MOCK_RECOMMENDATIONS: (EnrichedComic & { views: string })[] = [
  SOLO, TBATE, ORV, NANO, TOG, LNB, OP, JJK, BERSERK, BTTH, APOTHEOSIS, MARTIAL_PEAK,
];

export const MOCK_POPULAR_DAILY = [SOLO, JJK, ORV, BTTH, NANO, TOG];
export const MOCK_POPULAR_WEEKLY = [OP, TBATE, SOLO, MARTIAL_PEAK, LNB, BERSERK];
export const MOCK_POPULAR_ALL = [OP, SOLO, TOG, JJK, TBATE, BERSERK];

export const MOCK_SERIE_DETAIL: ComicDetailModel = {
  synopsis:
    "Sung Jinwoo, hunter peringkat-E yang dikenal sebagai senjata terlemah umat manusia, nyaris tewas di double dungeon. Sebuah jendela misterius muncul dan memberinya kesempatan kedua: sistem untuk naik level tanpa batas. Dari yang terlemah menjadi Shadow Monarch.",
  detailList: [
    { name: "Type", value: "Manhwa" },
    { name: "Status", value: "Completed" },
    { name: "Author", value: "Chugong" },
    { name: "Artist", value: "Dubu (REDICE Studio)" },
    { name: "Rating", value: "4.9" },
    { name: "Genres", value: "Action, Fantasy, Adventure" },
  ],
  chapterList: Array.from({ length: 10 }, (_, i) => {
    const n = 179 - i;
    return {
      title: `Chapter ${n}`,
      url: `https://shinigamiscans.com/series/solo-leveling/chapter/${n}/`,
      cover: cover("solo-leveling"),
      releaseDate: `${i + 1} hari lalu`,
    };
  }),
  related: [TBATE, ORV, NANO, LNB],
};

export const MOCK_CHAPTER_IMAGES: string[] = Array.from({ length: 8 }, (_, i) =>
  page("solo-leveling-ch1", i + 1),
);

export const MOCK_SERIE_META: EnrichedComic & { views: string } = SOLO;
