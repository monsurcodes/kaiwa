import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
   ActivityIndicator,
   Dimensions,
   Pressable,
   RefreshControl,
   ScrollView,
   Text,
   View,
} from "react-native";
import { useQuery } from "urql";

import ReleasingTodayCard from "@/shared/components/ReleasingTodayCard";
import TrendingMediaCard from "@/shared/components/TrendingMediaCard";
import { theme } from "@/shared/constants/theme";
import { GetPopularAnimeQuery } from "@/shared/lib/graphql/queries/getPopularAnime";
import { GetTrendingAnimeQuery } from "@/shared/lib/graphql/queries/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/shared/lib/graphql/queries/getTrendingManga";
import { compareTimestampTodayFirstTomorrowLast, isTimestampToday } from "@/shared/lib/utils/date";
import { refreshHomeScreenMedia } from "@/stores/actions/refreshData";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

interface SearchBarButtonProps {
   onPress: () => void;
}

const SearchBarButton = ({ onPress }: SearchBarButtonProps) => (
   <Pressable onPress={onPress} className="mt-2 rounded-md bg-slate-900/70 p-4">
      <View className="flex-row items-center">
         <Search color="white" size={20} />
         <Text className="ml-2 text-xl text-gray-400/70">What are you looking for?</Text>
      </View>
   </Pressable>
);

interface MediaSectionProps {
   title: string;
   data: unknown[] | null | undefined;
   renderItem: ({ item }: { item: unknown }) => React.ReactElement;
}

const MediaSection = ({ title, data, renderItem }: MediaSectionProps) => {
   if (!data || data.length === 0) return null;
   return (
      <>
         <Text className="mb-2 mt-10 text-xl font-semibold text-white">{title}</Text>
         <FlashList
            style={{ height: 350, width: "100%" }}
            data={data}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </>
   );
};

const Index = () => {
   const router = useRouter();
   const [refreshing, setRefreshing] = useState(false);

   const {
      trendingAnime,
      popularAnime,
      trendingManga,
      setTrendingAnime,
      setPopularAnime,
      setTrendingManga,
   } = useDataStore();

   const { userAnimeLibraryLists } = useAuthStore();

   const [animeResult] = useQuery({
      query: GetTrendingAnimeQuery,
      pause: Boolean(trendingAnime),
   });

   const [popularAnimeResult] = useQuery({
      query: GetPopularAnimeQuery,
      pause: Boolean(popularAnime),
   });

   const [mangaResult] = useQuery({
      query: GetTrendingMangaQuery,
      pause: Boolean(trendingManga),
   });

   useEffect(() => {
      const media = animeResult.data?.Page?.media;
      if (media && !trendingAnime) setTrendingAnime(media);
   }, [animeResult.data]); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      const media = popularAnimeResult.data?.Page?.media;
      if (media && !popularAnime) setPopularAnime(media);
   }, [popularAnimeResult.data]); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      const media = mangaResult.data?.Page?.media;
      if (media && !trendingManga) setTrendingManga(media);
   }, [mangaResult.data]); // eslint-disable-line react-hooks/exhaustive-deps

   const onRefresh = async () => {
      setRefreshing(true);
      await refreshHomeScreenMedia();
      setRefreshing(false);
   };

   const trendingAnimeData = trendingAnime ?? animeResult.data?.Page?.media;
   const popularAnimeData = popularAnime ?? popularAnimeResult.data?.Page?.media;
   const trendingMangaData = trendingManga ?? mangaResult.data?.Page?.media;

   const entries = userAnimeLibraryLists
      ?.flatMap((list) => list?.entries ?? [])
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

   const releasingEntries = entries
      ?.filter((entry) => isTimestampToday(entry?.media?.nextAiringEpisode?.airingAt))
      .sort((a, b) =>
         compareTimestampTodayFirstTomorrowLast(
            a?.media?.nextAiringEpisode?.airingAt,
            b?.media?.nextAiringEpisode?.airingAt,
         ),
      );

   const isInitialLoading =
      (!trendingAnime && animeResult.fetching) ||
      (!popularAnime && popularAnimeResult.fetching) ||
      (!trendingManga && mangaResult.fetching);

   if (isInitialLoading) {
      return (
         <View className="flex-1 gap-3">
            <SearchBarButton onPress={() => router.push("/search")} />
            <View className="flex-1 items-center justify-center">
               <ActivityIndicator size={30} />
            </View>
         </View>
      );
   }

   return (
      <View className="flex-1 gap-3">
         <SearchBarButton onPress={() => router.push("/search")} />

         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
               <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.accent.dark}
                  colors={[theme.accent.dark]}
                  progressBackgroundColor={theme.bg.overlay}
               />
            }
         >
            {releasingEntries && releasingEntries.length > 0 && (
               <View>
                  <Text className="mb-2 mt-6 text-xl font-semibold text-white">
                     Releasing Today
                  </Text>
                  <FlashList
                     data={releasingEntries}
                     renderItem={({ item }) => <ReleasingTodayCard item={item} />}
                     horizontal
                     showsHorizontalScrollIndicator={false}
                  />
               </View>
            )}

            <MediaSection
               title="Trending Anime"
               data={trendingAnimeData}
               renderItem={({ item }) => (
                  <TrendingMediaCard
                     media={item as NonNullable<typeof trendingAnimeData>[number]}
                     mediaType="ANIME"
                     cardWidth={CARD_WIDTH}
                  />
               )}
            />

            <MediaSection
               title="Popular Anime"
               data={popularAnimeData}
               renderItem={({ item }) => (
                  <TrendingMediaCard
                     media={item as NonNullable<typeof popularAnimeData>[number]}
                     mediaType="ANIME"
                     cardWidth={CARD_WIDTH}
                  />
               )}
            />

            <MediaSection
               title="Trending Manga"
               data={trendingMangaData}
               renderItem={({ item }) => (
                  <TrendingMediaCard
                     media={item as NonNullable<typeof trendingMangaData>[number]}
                     mediaType="MANGA"
                     cardWidth={CARD_WIDTH}
                  />
               )}
            />

            <View className="my-4" />
         </ScrollView>
      </View>
   );
};

export default Index;
