import { useState } from "react";
import { useQuery } from "urql";

import { MediaType } from "@/lib/graphql/generated/graphql";
import { GetUserLibraryQuery } from "@/lib/graphql/queries/getUserLibrary";

export const useGetUserLibrary = (userId: number | null) => {
   const [type, setType] = useState<MediaType>(MediaType.Anime);

   const [result] = useQuery({
      query: GetUserLibraryQuery,
      variables: {
         type,
         userId,
      },
      pause: userId === null,
   });

   const { data, fetching, error } = result;

   return { data, fetching, error, setType, type };
};
