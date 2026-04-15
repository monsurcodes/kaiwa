import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { useQuery } from "urql";

import TrendingMediaCard from "@/components/TrendingMediaCard";
import { GetTrendingAnimeQuery } from "@/lib/graphql/queries/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/lib/graphql/queries/getTrendingManga";
import { type TrendingAnimeInterface } from "@/types/trendingAnimeInterface";
import { type TrendingMangaInterface } from "@/types/trendingMangaInterface";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

const Index = () => {
   const [animeResult] = useQuery<TrendingAnimeInterface["data"]>({
      query: GetTrendingAnimeQuery,
   });

   const { data: animeList, fetching: animeFetching, error: animeError } = animeResult; // , error: animeError
   // console.log("Trending Anime Data:", animeList);

   if (animeError) console.error("Trending Anime Error:", animeError);

   const [mangaResult] = useQuery<TrendingMangaInterface["data"]>({
      query: GetTrendingMangaQuery,
   });

   const { data: mangaList, fetching: mangaFetching, error: mangaError } = mangaResult; // , error: mangaError
   // console.log("Trending Manga Data:", mangaList);

   if (mangaError) console.error("Trending Manga Error:", mangaError);

   return (
      <View className="flex-1">
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         >
            <Text className="mb-2 mt-6 text-xl font-semibold text-white">Trending Anime</Text>
            {animeFetching && <Text className="text-white">Loading...</Text>}
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
            <Text className="mb-2 mt-6 text-xl font-semibold text-white">Trending Manga</Text>
            {mangaFetching && <Text className="text-white">Loading...</Text>}
            {mangaList && (
               <FlashList
                  style={{ height: 350, width: "100%" }}
                  data={mangaList.Page.media}
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
                  horizontal
               ></FlashList>
            )}
         </ScrollView>
      </View>
   );
};

export default Index;
