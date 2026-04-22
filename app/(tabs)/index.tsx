import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { useQuery } from "urql";

import TrendingMediaCard from "@/components/TrendingMediaCard";
import { GetPopularAnimeQuery } from "@/lib/graphql/queries/getPopularAnime";
import { GetTrendingAnimeQuery } from "@/lib/graphql/queries/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/lib/graphql/queries/getTrendingManga";
import { useDataStore } from "@/stores/useDataStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

const Index = () => {
   const router = useRouter();
   const {
      trendingAnime,
      popularAnime,
      trendingManga,
      setTrendingAnime,
      setPopularAnime,
      setTrendingManga,
   } = useDataStore();

   const handleSearchPress = () => {
      router.push("/search");
   };
   // trending anime
   const [animeResult] = useQuery({
      query: GetTrendingAnimeQuery,
      pause: Boolean(trendingAnime),
   });

   const { data: animeList, fetching: animeFetching, error: animeError } = animeResult;

   // popular anime
   const [popularAnimeResult] = useQuery({
      query: GetPopularAnimeQuery,
      pause: Boolean(popularAnime),
   });

   const {
      data: popularAnimeList,
      fetching: popularAnimeFetching,
      error: popularAnimeError,
   } = popularAnimeResult;

   // trending manga
   const [mangaResult] = useQuery({
      query: GetTrendingMangaQuery,
      pause: Boolean(trendingManga),
   });

   const { data: mangaList, fetching: mangaFetching, error: mangaError } = mangaResult;

   useEffect(() => {
      if (!trendingAnime && animeList?.Page?.media) {
         setTrendingAnime(animeList.Page.media);
      }
   }, [animeList?.Page?.media, setTrendingAnime, trendingAnime]);

   useEffect(() => {
      if (!popularAnime && popularAnimeList?.Page?.media) {
         setPopularAnime(popularAnimeList.Page.media);
      }
   }, [popularAnime, popularAnimeList?.Page?.media, setPopularAnime]);

   useEffect(() => {
      if (!trendingManga && mangaList?.Page?.media) {
         setTrendingManga(mangaList.Page.media);
      }
   }, [mangaList?.Page?.media, setTrendingManga, trendingManga]);

   // TODO: handle errors properly
   if (animeError) console.error("Error fetching trending anime:", animeError);
   if (popularAnimeError) console.error("Error fetching popular anime:", popularAnimeError);
   if (mangaError) console.error("Error fetching trending manga:", mangaError);

   const shouldShowLoading =
      (!trendingAnime && animeFetching) ||
      (!popularAnime && popularAnimeFetching) ||
      (!trendingManga && mangaFetching);

   if (shouldShowLoading)
      return (
         <View className="flex-1 gap-3">
            <Pressable onPress={handleSearchPress} className="mt-2 rounded-md bg-slate-900/70 p-4">
               <View className="flex-row items-center">
                  <Search color="white" size={20} />
                  <Text className="ml-2 text-xl text-gray-400/70">What are you looking for?</Text>
               </View>
            </Pressable>
            <View className="flex items-center justify-center">
               <ActivityIndicator size={30} />
            </View>
         </View>
      );

   const trendingAnimeData = trendingAnime ?? animeList?.Page?.media;
   const popularAnimeData = popularAnime ?? popularAnimeList?.Page?.media;
   const trendingMangaData = trendingManga ?? mangaList?.Page?.media;

   return (
      <View className="flex-1 gap-3">
         {/* search bar */}
         <Pressable onPress={handleSearchPress} className="mt-2 rounded-md bg-slate-900/70 p-4">
            <View className="flex-row items-center">
               <Search color="white" size={20} />
               <Text className="ml-2 text-xl text-gray-400/70">What are you looking for?</Text>
            </View>
         </Pressable>

         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         >
            {/* Trending Anime */}
            {trendingAnimeData && (
               <Text className="mb-2 mt-6 text-xl font-semibold text-white">Trending Anime</Text>
            )}
            {trendingAnimeData && (
               <FlashList
                  style={{ height: 350, width: "100%" }}
                  data={trendingAnimeData}
                  renderItem={({ item }) => (
                     <TrendingMediaCard
                        id={item?.id ?? 0}
                        mediaType="ANIME"
                        title={item?.title?.english ?? item?.title?.romaji ?? ""}
                        score={item?.averageScore ?? 0}
                        likes={item?.favourites ?? 0}
                        coverImage={item?.coverImage?.large ?? ""}
                        bannerImage={item?.bannerImage ?? ""}
                        description={item?.description ?? "No description available"}
                        genres={(item?.genres ?? []).filter(
                           (genre): genre is string => genre !== null,
                        )}
                        secondText={item?.studios?.nodes?.[0]?.name ?? "Unknown Studio"}
                        cardWidth={CARD_WIDTH}
                     />
                  )}
                  horizontal
               ></FlashList>
            )}

            {/* Popular Anime */}
            {popularAnimeData && (
               <Text className="mb-2 mt-6 text-xl font-semibold text-white">Popular Anime</Text>
            )}
            {popularAnimeData && (
               <FlashList
                  style={{ height: 350, width: "100%" }}
                  data={popularAnimeData}
                  renderItem={({ item }) => (
                     <TrendingMediaCard
                        id={item?.id ?? 0}
                        mediaType="ANIME"
                        title={item?.title?.english ?? item?.title?.romaji ?? ""}
                        score={item?.averageScore ?? 0}
                        likes={item?.favourites ?? 0}
                        coverImage={item?.coverImage?.large ?? ""}
                        bannerImage={item?.bannerImage ?? ""}
                        description={item?.description ?? "No description available"}
                        genres={(item?.genres ?? []).filter(
                           (genre): genre is string => genre !== null,
                        )}
                        secondText={item?.studios?.nodes?.[0]?.name ?? "Unknown Studio"}
                        cardWidth={CARD_WIDTH}
                     />
                  )}
                  horizontal
               ></FlashList>
            )}

            {/* Trending Manga */}
            {trendingMangaData && (
               <Text className="mb-2 mt-6 text-xl font-semibold text-white">Trending Manga</Text>
            )}
            {trendingMangaData && (
               <FlashList
                  style={{ height: 350, width: "100%" }}
                  data={trendingMangaData}
                  horizontal
                  renderItem={({ item }) => (
                     <TrendingMediaCard
                        id={item?.id ?? 0}
                        mediaType="MANGA"
                        title={item?.title?.english ?? item?.title?.romaji ?? ""}
                        score={item?.averageScore ?? 0}
                        likes={item?.favourites ?? 0}
                        coverImage={item?.coverImage?.large ?? ""}
                        bannerImage={item?.bannerImage ?? ""}
                        description={item?.description ?? "No description available"}
                        genres={(item?.genres ?? []).filter(
                           (genre): genre is string => genre !== null,
                        )}
                        cardWidth={CARD_WIDTH}
                     />
                  )}
               ></FlashList>
            )}
            <View className="my-4"></View>
         </ScrollView>
      </View>
   );
};

export default Index;
