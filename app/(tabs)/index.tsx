import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from "react-native";
import { useQuery } from "urql";

import TrendingMediaCard from "@/components/TrendingMediaCard";
import { GetPopularAnimeQuery } from "@/lib/graphql/queries/getPopularAnime";
import { GetTrendingAnimeQuery } from "@/lib/graphql/queries/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/lib/graphql/queries/getTrendingManga";
import { PopularAnimeInterface } from "@/types/popularAnimeInterface";
import { type TrendingAnimeInterface } from "@/types/trendingAnimeInterface";
import { type TrendingMangaInterface } from "@/types/trendingMangaInterface";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

const Index = () => {
   // trending anime
   const [animeResult] = useQuery<TrendingAnimeInterface["data"]>({
      query: GetTrendingAnimeQuery,
   });

   const { data: animeList, fetching: animeFetching, error: animeError } = animeResult;

   // popular anime
   const [popularAnimeResult] = useQuery<PopularAnimeInterface["data"]>({
      query: GetPopularAnimeQuery,
   });

   const {
      data: popularAnimeList,
      fetching: popularAnimeFetching,
      error: popularAnimeError,
   } = popularAnimeResult;

   // trending manga
   const [mangaResult] = useQuery<TrendingMangaInterface["data"]>({
      query: GetTrendingMangaQuery,
   });

   const { data: mangaList, fetching: mangaFetching, error: mangaError } = mangaResult;

   // TODO: handle errors properly
   if (animeError) console.error("Error fetching trending anime:", animeError);
   if (popularAnimeError) console.error("Error fetching popular anime:", popularAnimeError);
   if (mangaError) console.error("Error fetching trending manga:", mangaError);

   if (animeFetching || popularAnimeFetching || mangaFetching)
      return (
         <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} />
         </View>
      );

   return (
      <View className="flex-1">
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         >
            {/* Trending Anime */}
            {animeList && (
               <Text className="mb-2 mt-6 text-xl font-semibold text-white">Trending Anime</Text>
            )}
            {animeList && (
               <FlashList
                  style={{ height: 350, width: "100%" }}
                  data={animeList.Page.media}
                  renderItem={({ item }) => (
                     <TrendingMediaCard
                        id={item.id}
                        mediaType="ANIME"
                        title={item.title.english}
                        altTitle={item.title.romaji}
                        score={item.averageScore}
                        likes={item.favourites}
                        coverImage={item.coverImage.large}
                        bannerImage={item.bannerImage}
                        description={item.description}
                        genres={item.genres}
                        secondText={item.studios.nodes[0]?.name || "Unknown Studio"}
                        cardWidth={CARD_WIDTH}
                     />
                  )}
                  horizontal
               ></FlashList>
            )}

            {/* Popular Anime */}
            {popularAnimeList && (
               <Text className="mb-2 mt-6 text-xl font-semibold text-white">Popular Anime</Text>
            )}
            {popularAnimeList && (
               <FlashList
                  style={{ height: 350, width: "100%" }}
                  data={popularAnimeList.Page.media}
                  renderItem={({ item }) => (
                     <TrendingMediaCard
                        id={item.id}
                        mediaType="ANIME"
                        title={item.title.english}
                        altTitle={item.title.romaji}
                        score={item.averageScore}
                        likes={item.favourites}
                        coverImage={item.coverImage.large}
                        bannerImage={item.bannerImage}
                        description={item.description}
                        genres={item.genres}
                        secondText={item.studios.nodes[0]?.name || "Unknown Studio"}
                        cardWidth={CARD_WIDTH}
                     />
                  )}
                  horizontal
               ></FlashList>
            )}

            {/* Trending Manga */}
            {mangaList && (
               <Text className="mb-2 mt-6 text-xl font-semibold text-white">Trending Manga</Text>
            )}
            {mangaList && (
               <FlashList
                  style={{ height: 350, width: "100%" }}
                  data={mangaList.Page.media}
                  horizontal
                  renderItem={({ item }) => (
                     <TrendingMediaCard
                        id={item.id}
                        mediaType="MANGA"
                        title={item.title.english}
                        altTitle={item.title.romaji}
                        score={item.averageScore}
                        likes={item.favourites}
                        coverImage={item.coverImage.large}
                        bannerImage={item.bannerImage}
                        description={item.description}
                        genres={item.genres}
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
