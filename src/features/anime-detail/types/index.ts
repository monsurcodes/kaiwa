import type { GetAnimeByIdQuery } from "@/shared/lib/graphql/generated/graphql";

export type AnimeMedia = NonNullable<GetAnimeByIdQuery["Media"]>;
