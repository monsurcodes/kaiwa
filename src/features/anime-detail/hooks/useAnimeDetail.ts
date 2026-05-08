import { useQuery } from "urql";

import { GetAnimeByIdQuery } from "../api/getAnimeById";

export const useAnimeDetail = (mediaId: number | null) => {
   const [results] = useQuery({
      query: GetAnimeByIdQuery,
      variables: {
         mediaId: mediaId ?? 0,
      },
      pause: mediaId === null,
   });

   const { data, fetching, error } = results;

   return { data, fetching, error };
};
