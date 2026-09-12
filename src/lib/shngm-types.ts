export interface TaxonomyEntry {
  taxonomy_id?: number;
  slug: string;
  name: string;
}

export interface MangaTaxonomy {
  Artist?: TaxonomyEntry[];
  Author?: TaxonomyEntry[];
  Format?: TaxonomyEntry[];
  Genre?: TaxonomyEntry[];
  Type?: TaxonomyEntry[];
}

export interface MangaItem {
  manga_id: string;
  title: string;
  description: string;
  alternative_title: string;
  release_year: string;
  status: number;
  cover_image_url: string;
  cover_portrait_url: string;
  view_count: number;
  user_rate: number;
  latest_chapter_id: string;
  latest_chapter_number: number;
  latest_chapter_time: string;
  country_id: string;
  bookmark_count: number;
  rank: number;
  is_recommended?: boolean;
  taxonomy?: MangaTaxonomy;
  created_at: string;
  updated_at: string;
}

export interface ChapterEntry {
  chapter_id: string;
  chapter_number: number;
  created_at: string;
  chapter_title?: string;
  thumbnail_image_url?: string;
  view_count?: number;
}

export interface MangaDetail extends MangaItem {
  id: number;
  chapters?: ChapterEntry[];
}

export interface ChapterImages {
  path: string;
  data: string[];
}

export interface ChapterDetail {
  chapter_id: string;
  manga_id: string;
  chapter_number: number;
  chapter_title: string;
  base_url: string;
  chapter: ChapterImages;
  thumbnail_image_url: string;
  view_count: number;
  prev_chapter_id: string | null;
  prev_chapter_number: number | null;
  next_chapter_id: string | null;
  next_chapter_number: number | null;
  release_date: string;
}

export interface SliderItem {
  id: number;
  title: string;
  rating: string;
  background_image: string;
  chara_image: string;
  slider_link: string;
  blur_color: string;
  category: string;
  category_id: number;
  detail: string;
  badges: { badge_id: number; badge_name: string; badge_color: string }[];
}

export interface AnnouncementItem {
  announcement_id: string;
  title: string;
  thumbnail_image_url: string;
  publish_status: number;
  created_date: string;
}

export interface PageMeta {
  page: number;
  page_size: number;
  total_page: number;
  total_record: number;
}

export interface ApiEnvelope<T> {
  retcode: number;
  message: string;
  meta: PageMeta & { request_id: string; timestamp: number; process_time: string };
  data: T;
}

export type MangaFormat = "manhwa" | "manga" | "manhua";
export type TopFilter = "daily" | "weekly" | "all_time";
export type ListType = "project" | "mirror";

export interface GenreItem {
  genre_id?: number | string;
  taxonomy_id?: number;
  slug: string;
  name: string;
}
