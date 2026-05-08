import { AnimeMedia } from "@/features/anime-detail/types";
import { MangaMedia } from "@/features/manga-detail/types";
import type { GetMediaCharactersQuery } from "@/shared/lib/graphql/generated/graphql";

export type CharacterEdge = NonNullable<
   NonNullable<
      NonNullable<NonNullable<GetMediaCharactersQuery["Media"]>["characters"]>["edges"]
   >[number]
>;

export type SharedMedia = MangaMedia | AnimeMedia;
