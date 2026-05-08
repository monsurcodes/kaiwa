import { FlashList } from "@shopify/flash-list";
import { Search } from "lucide-react-native";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { SearchTrendingMediaCard, useSearchData } from "@/features/search-screen";
import { MediaType } from "@/shared/lib/graphql/generated/graphql";

const SearchScreen = () => {
   const {
      searchQuery,
      setSearchQuery,
      setDebouncedSearchQuery,
      mediaType,
      setMediaPage,
      nextMediaType,
      setMediaType,
      setAllTrendingMedia,
      searchPlaceholderText,
      displayData,
      isSearching,
      isFetching,
      loadMoreMedia,
   } = useSearchData();

   // Immediate input handler
   const handleSearchChange = (text: string) => {
      setSearchQuery(text);
      if (text.trim() === "") {
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

   return (
      <View className="w-full flex-1">
         <View className="mt-2 flex-row items-center gap-2">
            <View className="flex-1 flex-row items-center rounded-md bg-slate-900/70 px-4 py-2">
               <Search color="#94a3b8" size={18} />
               <TextInput
                  placeholder={searchPlaceholderText}
                  placeholderTextColor="#64748b"
                  className="ml-2 flex-1 text-base text-white"
                  value={searchQuery}
                  onChangeText={handleSearchChange}
               />
            </View>

            <Pressable onPress={toggleMediaType} className="rounded-md bg-accent px-4 py-3">
               <Text className="text-xs font-black text-white">
                  {nextMediaType === MediaType.Anime ? "ANIME" : "MANGA"}
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
                     status={item.mediaListEntry?.status}
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
