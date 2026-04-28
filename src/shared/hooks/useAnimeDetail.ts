import { useQuery } from "urql";

import { GetAnimeByIdQuery } from "@/shared/lib/graphql/queries/getAnimeById";

export const useAnimeDetail = (mediaId: number | null) => {
   // query animes
   const [results] = useQuery({
      query: GetAnimeByIdQuery,
      variables: {
         mediaId: mediaId ?? 0,
      },
      pause: mediaId === null,
   });

   // extract animes from query results
   const { data, fetching, error } = results;

   return { data, fetching, error };
};
