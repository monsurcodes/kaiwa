import type {
   GetMediaByNameQuery,
   SearchTrendingMediaQuery,
} from "@/shared/lib/graphql/generated/graphql";

export type TrendingMediaEdge = NonNullable<SearchTrendingMediaQuery["Page"]>;
export type TrendingMediaItem = NonNullable<NonNullable<TrendingMediaEdge["media"]>[number]>;

export type SearchMediaEdge = NonNullable<GetMediaByNameQuery["Page"]>;
export type SearchMediaItem = NonNullable<NonNullable<SearchMediaEdge["media"]>[number]>;
