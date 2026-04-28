import type {
   GetAnimeByIdQuery as GetAnimeByIdQueryData,
   GetAuthUserDataQuery as GetAuthUserData,
   GetMangaByIdQuery as GetMangaByIdQueryData,
   GetMediaCharactersQuery as GetMediaCharactersData,
   GetPopularAnimeQuery as GetPopularAnimeQueryData,
   GetTrendingAnimeQuery as GetTrendingAnimeQueryData,
   GetTrendingMangaQuery as GetTrendingMangaQueryData,
   GetUserLibraryQuery as GetUserLibraryData,
} from "@/shared/lib/graphql/generated/graphql";

export type CharacterEdge = NonNullable<
   NonNullable<
      NonNullable<NonNullable<GetMediaCharactersData["Media"]>["characters"]>["edges"]
   >[number]
>;

export type AnimeMedia = NonNullable<GetAnimeByIdQueryData["Media"]>;
export type MangaMedia = NonNullable<GetMangaByIdQueryData["Media"]>;

export type SharedMedia = MangaMedia | AnimeMedia;

export type UserProfile = NonNullable<GetAuthUserData["Viewer"]>;

export type UserLibraryLists = NonNullable<
   NonNullable<GetUserLibraryData["MediaListCollection"]>["lists"]
>;

export type TrendingAnimeMedia = NonNullable<
   NonNullable<GetTrendingAnimeQueryData["Page"]>["media"]
>;
export type PopularAnimeMedia = NonNullable<NonNullable<GetPopularAnimeQueryData["Page"]>["media"]>;
export type TrendingMangaMedia = NonNullable<
   NonNullable<GetTrendingMangaQueryData["Page"]>["media"]
>;

type LibraryEntry = NonNullable<
   NonNullable<
      NonNullable<NonNullable<GetUserLibraryData["MediaListCollection"]>["lists"]>[number]
   >["entries"]
>[number];

export type LibraryListItem =
   | { type: "header"; name: string }
   | { type: "card"; entry: NonNullable<LibraryEntry> };
