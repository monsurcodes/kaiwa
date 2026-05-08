import type { GetMangaByIdQuery } from "@/shared/lib/graphql/generated/graphql";

export type MangaMedia = NonNullable<GetMangaByIdQuery["Media"]>;
