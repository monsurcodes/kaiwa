import type {
   GetAnimeByIdQuery as GetAnimeByIdQueryData,
   GetAuthUserDataQuery as GetAuthUserData,
   GetMangaByIdQuery as GetMangaByIdQueryData,
   GetMediaCharactersQuery as GetMediaCharactersData,
   GetUserLibraryQueryQuery as GetUserLibraryData,
} from "@/lib/graphql/generated/graphql";

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
