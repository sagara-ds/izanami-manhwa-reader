export interface ComicModel {
  title: string;
  url: string;
  cover: string;
  latestChapter: string;
  latestChapterUrl: string;
  rating: number;
}

export interface BrowseModel {
  hotList: ComicModel[];
  newsList: ComicModel[];
  trendingList: ComicModel[];
}

export interface ComicDetailInfo {
  name: string;
  value: string;
}

export interface ChapterModel {
  title: string;
  url: string;
  cover: string;
  releaseDate: string;
}

export interface ComicDetailModel {
  synopsis: string;
  detailList: ComicDetailInfo[];
  chapterList: ChapterModel[];
  related: ComicModel[];
}

export interface ComicFullModel {
  comicModel: ComicModel;
  comicDetailModel: ComicDetailModel;
}

export interface ChapterDetailModel {
  imageList: string[];
}

export type ComicType = "manhwa" | "manga" | "manhua";

export interface EnrichedComic extends ComicModel {
  comicType?: ComicType;
  genres?: string[];
}
