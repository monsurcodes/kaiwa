import { useMemo, useState } from "react";

import { MediaType } from "@/shared/lib/graphql/generated/graphql";
import { useAuthStore } from "@/stores/authStore";

import { LibraryListItem } from "../types";

export const useLibraryData = () => {
   const { userAnimeLibraryLists, userMangaLibraryLists, userProfile } = useAuthStore();

   const [activeType, setActiveType] = useState<MediaType>(MediaType.Anime);
   const [statusFilter, setStatusFilter] = useState("ALL");
   const [searchQuery, setSearchQuery] = useState("");

   const sectionOrder = useMemo(() => {
      const order =
         (activeType === MediaType.Anime
            ? userProfile?.mediaListOptions?.animeList?.sectionOrder
            : userProfile?.mediaListOptions?.mangaList?.sectionOrder) ?? [];

      return ["ALL", ...order.filter((name): name is string => Boolean(name && name.length > 0))];
   }, [userProfile, activeType]);

   const flattenedData = useMemo(() => {
      const isAnime = activeType === MediaType.Anime;
      const sourceLists = isAnime ? userAnimeLibraryLists : userMangaLibraryLists;
      const order = sectionOrder.filter((s) => s !== "ALL");

      if (!sourceLists) return [];

      const result: LibraryListItem[] = [];

      order.forEach((sectionName) => {
         if (statusFilter !== "ALL" && sectionName !== statusFilter) return;

         const currentList = sourceLists.find((l) => l?.name === sectionName);
         if (!currentList?.entries) return;

         const filteredEntries = currentList.entries.filter(
            (entry): entry is NonNullable<typeof entry> => {
               if (!entry) return false;
               const title = (
                  entry?.media?.title?.english ??
                  entry?.media?.title?.romaji ??
                  ""
               ).toLowerCase();
               return title.includes(searchQuery.toLowerCase());
            },
         );

         if (filteredEntries.length > 0) {
            result.push({ type: "header", name: sectionName });

            const sortedEntries = [...filteredEntries].sort((a, b) => {
               const titleA = a?.media?.title?.english || a?.media?.title?.romaji || "";
               const titleB = b?.media?.title?.english || b?.media?.title?.romaji || "";
               return titleA.localeCompare(titleB);
            });

            sortedEntries.forEach((entry) => {
               result.push({ type: "card", entry });
            });
         }
      });

      return result;
   }, [
      userAnimeLibraryLists,
      userMangaLibraryLists,
      sectionOrder,
      activeType,
      statusFilter,
      searchQuery,
   ]);

   return {
      flattenedData,
      sectionOrder,
      activeType,
      setActiveType,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
   };
};
