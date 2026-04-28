import { useQuery } from "urql";

import { GetMangaByIdQuery } from "@/shared/lib/graphql/queries/getMangaById";

export const useMangaDetail = (mediaId: number | null) => {
   // query mangas
   const [results] = useQuery({
      query: GetMangaByIdQuery,
      variables: {
         mediaId: mediaId ?? 0,
      },
      pause: mediaId === null,
   });

   // extract mangas from query results
   const { data, fetching, error } = results;

   return { data, fetching, error };
};
