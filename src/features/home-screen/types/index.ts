import type {
   GetPopularAnimeQuery,
   GetTrendingAnimeQuery,
   GetTrendingMangaQuery,
} from "@/shared/lib/graphql/generated/graphql";

export type TrendingAnimeMedia = NonNullable<NonNullable<GetTrendingAnimeQuery["Page"]>["media"]>;
export type PopularAnimeMedia = NonNullable<NonNullable<GetPopularAnimeQuery["Page"]>["media"]>;
export type TrendingMangaMedia = NonNullable<NonNullable<GetTrendingMangaQuery["Page"]>["media"]>;

export type HomeTrendingMediaItem =
   | NonNullable<TrendingAnimeMedia[number]>
   | NonNullable<PopularAnimeMedia[number]>
   | NonNullable<TrendingMangaMedia[number]>;
