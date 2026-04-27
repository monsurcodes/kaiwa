import { FlashList } from "@shopify/flash-list";
import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, RefreshControl, Text, TextInput, View } from "react-native";

import LibraryMediaCard from "@/components/LibraryMediaCard";
import { theme } from "@/constants/theme";
import { MediaType } from "@/lib/graphql/generated/graphql";
import { refreshUserLibrary } from "@/stores/actions/refreshData";
import { useAuthStore } from "@/stores/authStore";
import { LibraryListItem } from "@/types";

const Library = () => {
   const { userAnimeLibraryLists, userMangaLibraryLists, userProfile } = useAuthStore();

   const [refreshing, setRefreshing] = useState(false);

   const onRefresh = async () => {
      setRefreshing(true);
      await refreshUserLibrary();
      setRefreshing(false);
   };

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

   return (
      <View className="w-full flex-1">
         {/* --- SEARCH & TOGGLE --- */}
         <View className="mt-2 flex-row items-center gap-2">
            <View className="flex-1 flex-row items-center rounded-md bg-slate-900/70 px-4 py-2">
               <Search color="#94a3b8" size={18} />
               <TextInput
                  placeholder={`Search in ${activeType.toLowerCase()} list...`}
                  placeholderTextColor="#64748b"
                  className="ml-2 flex-1 text-base text-white"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
               />
            </View>

            <Pressable
               onPress={() => {
                  setActiveType((prev) =>
                     prev === MediaType.Anime ? MediaType.Manga : MediaType.Anime,
                  );
                  setStatusFilter("ALL");
               }}
               className="rounded-md bg-accent px-4 py-3 active:bg-accent-dark"
            >
               <Text className="text-[10px] font-black text-white">
                  {activeType === MediaType.Anime ? "MANGA" : "ANIME"}
               </Text>
            </Pressable>
         </View>

         <View className="mt-4" style={{ height: 40 }}>
            <FlashList
               data={sectionOrder}
               horizontal
               showsHorizontalScrollIndicator={false}
               renderItem={({ item }) => (
                  <Pressable
                     onPress={() => setStatusFilter(item)}
                     className={`mr-2 rounded-full px-5 py-2 ${statusFilter === item ? "bg-white" : "bg-slate-800"}`}
                  >
                     <Text
                        className={`text-center text-xs font-bold uppercase ${statusFilter === item ? "text-black" : "text-gray-400"}`}
                     >
                        {item}
                     </Text>
                  </Pressable>
               )}
            />
         </View>

         <View className="mt-2 flex-1 px-1">
            <FlashList
               data={flattenedData}
               keyExtractor={(item, index) =>
                  item.type === "header" ? `h-${item.name}` : `c-${item.entry.media?.id}-${index}`
               }
               getItemType={(item) => item.type}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingBottom: 100 }}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                     tintColor={theme.accent.dark}
                     colors={[theme.accent.dark]}
                     progressBackgroundColor={theme.bg.overlay}
                  />
               }
               renderItem={({ item }) => {
                  if (item.type === "header") {
                     return (
                        <Text className="mb-4 mt-8 px-2 text-2xl font-bold text-text-primary">
                           {item.name}
                        </Text>
                     );
                  }
                  const { id, media, progress, status } = item.entry;
                  return (
                     <LibraryMediaCard
                        listEntryId={id}
                        id={media?.id}
                        title={media?.title?.english ?? media?.title?.romaji}
                        image={media?.coverImage?.large}
                        episodes={media?.episodes}
                        chapters={media?.chapters}
                        volumes={media?.volumes}
                        format={media?.format}
                        type={media?.type}
                        progress={progress}
                        status={status}
                        nextAiringAt={media?.nextAiringEpisode?.airingAt}
                        nextAiringEpisode={media?.nextAiringEpisode?.episode}
                     />
                  );
               }}
               ListEmptyComponent={() => (
                  <View className="mt-20 items-center">
                     <Text className="text-gray-500">No results found in this section.</Text>
                  </View>
               )}
            />
         </View>
      </View>
   );
};

export default Library;
