import { FlashList } from "@shopify/flash-list";
import { Search } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { useQuery } from "urql";

import SearchTrendingMediaCard from "@/components/SearchTrendingMediaCard";
import type {
   GetMediaByNameQuery as GetMediaByNameData,
   SearchTrendingMediaQuery as SearchTrendingMediaData,
} from "@/lib/graphql/generated/graphql";
import { MediaType } from "@/lib/graphql/generated/graphql";
import { GetMediaByNameQuery } from "@/lib/graphql/queries/getMediaByName";
import { SearchTrendingMediaQuery } from "@/lib/graphql/queries/searchTrendingMedia";

type TrendingMediaEdge = NonNullable<SearchTrendingMediaData["Page"]>;
type TrendingMediaItem = NonNullable<NonNullable<TrendingMediaEdge["media"]>[number]>;

type SearchMediaEdge = NonNullable<GetMediaByNameData["Page"]>;
type SearchMediaItem = NonNullable<NonNullable<SearchMediaEdge["media"]>[number]>;

const SearchScreen = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
   const [mediaType, setMediaType] = useState<MediaType>(MediaType.Anime);
   const [mediaPage, setMediaPage] = useState(1);
   const [allTrendingMedia, setAllTrendingMedia] = useState<TrendingMediaItem[]>([]);

   // Immediate input handler
   const handleSearchChange = (text: string) => {
      setSearchQuery(text);
      if (text.trim() === "") {
         Keyboard.dismiss();
         setDebouncedSearchQuery("");
         setMediaPage(1);
      }
   };

   // Reset trending data strictly on type switch
   const toggleMediaType = () => {
      const nextType = mediaType === MediaType.Anime ? MediaType.Manga : MediaType.Anime;
      setMediaType(nextType);
      setAllTrendingMedia([]);
      setMediaPage(1);
   };

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

   return (
      <View className="w-full flex-1">
         <View className="mt-2 flex-row items-center justify-between rounded-md bg-slate-900/70 px-4 py-2">
            <View className="flex-1 flex-row items-center">
               <Search color="white" size={20} />
               <TextInput
                  className="ml-2 flex-1 text-xl text-white"
                  placeholder={searchPlaceholderText}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  autoFocus={true}
                  clearButtonMode="while-editing"
               />
            </View>

            <Pressable
               onPress={toggleMediaType}
               className="ml-2 rounded-md bg-primary/70 px-3 py-1.5"
            >
               <Text className="text-[10px] font-semibold text-white">
                  SWITCH TO {nextMediaType}
               </Text>
            </Pressable>
         </View>

         <View className="mt-6 flex-1 px-1">
            <FlashList
               data={displayData}
               keyExtractor={(item) => item.id.toString()}
               onEndReached={loadMoreMedia}
               onEndReachedThreshold={0.5}
               keyboardDismissMode="on-drag"
               keyboardShouldPersistTaps="handled"
               showsVerticalScrollIndicator={false}
               ListEmptyComponent={
                  !isFetching && isSearching ? (
                     <Text className="mt-10 text-center text-gray-400">No results found.</Text>
                  ) : null
               }
               renderItem={({ item }) => (
                  <SearchTrendingMediaCard
                     id={item.id}
                     title={item.title?.english ?? item.title?.romaji ?? ""}
                     image={item.coverImage?.large ?? ""}
                     format={item.format ?? ""}
                     score={item.averageScore ?? 0}
                     favourites={item.favourites ?? 0}
                     seasonYear={item.seasonYear ?? 0}
                     episodes={item.episodes}
                     chapters={item.chapters}
                     genres={(item.genres ?? []).filter((g): g is string => g !== null)}
                     type={item.type ?? ""}
                  />
               )}
               ListFooterComponent={
                  isFetching ? (
                     <View className="my-6 items-center">
                        <ActivityIndicator size="large" />
                     </View>
                  ) : null
               }
            />
         </View>
      </View>
   );
};

export default SearchScreen;
