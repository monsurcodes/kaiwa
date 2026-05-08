import { useQuery } from "urql";

import { GetMangaByIdQuery } from "../api/getMangaById";

export const useMangaDetail = (mediaId: number | null) => {
   const [results] = useQuery({
      query: GetMangaByIdQuery,
      variables: {
         mediaId: mediaId ?? 0,
      },
      pause: mediaId === null,
   });

   const { data, fetching, error } = results;

   return { data, fetching, error };
};
