import { useEffect, useMemo, useState } from "react";
import { useQuery } from "urql";

import { MediaType } from "@/shared/lib/graphql/generated/graphql";

import { GetMediaByNameQuery } from "../api/getMediaByName";
import { SearchTrendingMediaQuery } from "../api/searchTrendingMedia";
import { SearchMediaItem, TrendingMediaItem } from "../types";

export const useSearchData = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
   const [mediaType, setMediaType] = useState<MediaType>(MediaType.Anime);
   const [mediaPage, setMediaPage] = useState(1);
   const [allTrendingMedia, setAllTrendingMedia] = useState<TrendingMediaItem[]>([]);

   // Debounce Effect
   useEffect(() => {
      if (searchQuery.trim() === "") {
         setDebouncedSearchQuery("");
         return;
      }
      const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
      return () => clearTimeout(handler);
   }, [searchQuery]);

   // GraphQL Queries
   const [searchResults] = useQuery({
      query: GetMediaByNameQuery,
      variables: { type: mediaType, search: debouncedSearchQuery },
      pause: debouncedSearchQuery.trim() === "",
   });

   const [trendingResults] = useQuery({
      query: SearchTrendingMediaQuery,
      variables: { type: mediaType, page: mediaPage },
      pause: searchQuery.trim().length > 0, // Pause trending fetch while searching
   });

   const { data: searchData, fetching: searchFetching } = searchResults;
   const { data: trendingData, fetching: trendingFetching } = trendingResults;

   // Display Logic
   const isSearching = searchQuery.trim().length > 0;

   const displayData = useMemo(() => {
      if (isSearching) {
         return (searchData?.Page?.media ?? []).filter(
            (item): item is SearchMediaItem => item != null,
         );
      }
      return allTrendingMedia;
   }, [isSearching, searchData, allTrendingMedia]);

   const isFetching = isSearching ? searchFetching : trendingFetching;
   const nextMediaType = mediaType === MediaType.Anime ? MediaType.Manga : MediaType.Anime;
   const searchPlaceholderText = `Search ${mediaType.toLowerCase()}...`;

   // Data with Pagination
   useEffect(() => {
      const media = trendingData?.Page?.media;
      if (!Array.isArray(media)) return;

      const nonNullMedia = media.filter((item): item is TrendingMediaItem => item != null);

      setAllTrendingMedia((prev) => {
         if (mediaPage === 1) return nonNullMedia;

         const existingIds = new Set(prev.map((item) => item.id));
         const nextItems = nonNullMedia.filter((item) => !existingIds.has(item.id));
         return nextItems.length ? [...prev, ...nextItems] : prev;
      });
   }, [trendingData, mediaPage]);

   const loadMoreMedia = () => {
      if (!trendingFetching && !isSearching) {
         setMediaPage((prev) => prev + 1);
      }
   };

   return {
      searchQuery,
      setSearchQuery,
      mediaType,
      setMediaType,
      displayData,
      isFetching,
      nextMediaType,
      searchPlaceholderText,
      loadMoreMedia,
      setDebouncedSearchQuery,
      setMediaPage,
      setAllTrendingMedia,
      isSearching,
   };
};
