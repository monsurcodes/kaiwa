import { useEffect, useState } from "react";
import { useQuery } from "urql";

import { GetMediaCharactersQuery } from "@/lib/graphql/queries/getMediaCharacters";
import { CharacterEdge } from "@/types";

export const useCharacters = (mediaId: number | null) => {
   const [page, setPage] = useState(1);
   const [characters, setCharacters] = useState<CharacterEdge[]>([]);

   // query characters
   const [results] = useQuery({
      query: GetMediaCharactersQuery,
      variables: {
         mediaId: mediaId ?? 0,
         page: page,
      },
      pause: mediaId === null,
   });

   // extract characters from query results
   const { data, fetching, error } = results;

   // reset characters and page when mediaId changes
   useEffect(() => {
      setPage(1);
      setCharacters([]);
   }, [mediaId]);

   // set characters
   useEffect(() => {
      const nextEdges = (data?.Media?.characters?.edges ?? []).filter(
         (edge): edge is CharacterEdge => Boolean(edge),
      );

      if (page === 1) {
         setCharacters(nextEdges);
         return;
      }

      if (!nextEdges.length) return;

      setCharacters((prev) => {
         const existingIds = new Set(prev.map((edge) => edge.node?.id));
         const merged = [...prev];

         for (const edge of nextEdges) {
            if (existingIds.has(edge.node?.id)) continue;

            existingIds.add(edge.node?.id);
            merged.push(edge);
         }

         return merged;
      });
   }, [data, page]);

   // load more characters function
   const loadMore = () => {
      if (!fetching && data?.Media?.characters?.pageInfo?.hasNextPage) {
         setPage((prev) => prev + 1);
      }
   };

   return { characters, fetching, error, loadMore };
};
