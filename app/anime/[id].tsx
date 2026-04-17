import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
   ActivityIndicator,
   Image,
   LayoutAnimation,
   Platform,
   Pressable,
   Text,
   UIManager,
   View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import YoutubePlayer from "react-native-youtube-iframe";
import { useQuery } from "urql";

import CharacterCard from "@/components/CharacterCard";
import RecommendationCard from "@/components/RecommendationCard";
import RelationCard from "@/components/RelationCard";
import { GetAnimeByIdQuery } from "@/lib/graphql/queries/getAnimeById";
import { formatAiringDate } from "@/lib/utils/date";
import { AnimeByIdInterface } from "@/types/animeByIdInterface";

// Enable LayoutAnimation for Android (Required for smooth transitions)
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
   UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Anime = () => {
   // youtube trailer
   const [playing, setPlaying] = useState(false);

   const onStateChange = useCallback((state: string) => {
      if (state === "ended") {
         setPlaying(false);
      }
   }, []);

   // synopsis expand/collapse
   const [isExpanded, setIsExpanded] = useState(false);

   const toggleExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(!isExpanded);
   };

   const { id } = useLocalSearchParams();
   const [anime] = useQuery<AnimeByIdInterface["data"]>({
      query: GetAnimeByIdQuery,
      variables: {
         mediaId: Number(id),
      },
   });
   const { data, fetching, error } = anime;

   if (error) console.error("Error fetching anime data:", error);

   console.log("Fetched anime id:", data?.Media.id);

   if (fetching)
      return (
         <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} />
         </View>
      );

   if (!data)
      return <Text className="flex-1 items-center justify-center text-white">Anime not found</Text>;

   return (
      <View>
         <ScrollView
            className="min-h-screen flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         >
            {/* header */}
            <View className="relative h-64">
               <Image
                  source={{ uri: data.Media.bannerImage || data.Media.coverImage.extraLarge }}
                  className="absolute inset-0 h-full w-full"
                  resizeMode="cover"
               />

               <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.9)"]}
                  className="absolute inset-0 flex-col justify-end p-3"
               >
                  <View className="flex-row items-end">
                     <View className="shadow-lg">
                        <Image
                           source={{
                              uri: data.Media.coverImage.extraLarge || data.Media.bannerImage,
                           }}
                           className="mr-2 h-40 w-28 rounded-md"
                        />
                     </View>
                     <View className="flex-1 gap-1 pb-1">
                        <Text className="text-lg font-bold leading-tight text-white">
                           {data.Media.title.english ||
                              data.Media.title.romaji ||
                              data.Media.title.native}
                        </Text>

                        <Text className="text-xs text-white">{data.Media.startDate.year}</Text>

                        <Text className="text-sm font-semibold text-white">
                           {data.Media.format} • {data.Media.episodes} episodes
                        </Text>

                        {data.Media.nextAiringEpisode && (
                           <Text className="mt-2 text-sm text-green-300">
                              ● EP {data.Media.nextAiringEpisode.episode} on{" "}
                              {formatAiringDate(data.Media.nextAiringEpisode.airingAt)}{" "}
                           </Text>
                        )}
                     </View>
                  </View>
               </LinearGradient>
            </View>

            <View className="flex-1 p-4">
               {/* genres */}
               <FlashList
                  data={data.Media.genres}
                  className="mb-4"
                  horizontal
                  renderItem={({ item }) => (
                     <Text className="mb-2 mr-2 rounded-md bg-slate-700 px-2 py-1 text-xs text-white">
                        {item}
                     </Text>
                  )}
               />

               {/* synopsis */}
               <View className="mb-6 flex-1">
                  <Text className="mb-2 text-lg font-semibold text-white">Synopsis</Text>
                  <Pressable onPress={toggleExpand}>
                     <Text
                        className="leading-5 text-gray-300"
                        numberOfLines={isExpanded ? undefined : 4}
                     >
                        {data.Media.description}
                     </Text>

                     <Text className="mt-1 text-xs font-bold text-white">
                        {isExpanded ? "Show Less" : "Read More..."}
                     </Text>
                  </Pressable>
               </View>

               {/* youtube trailer */}
               {data.Media.trailer && data.Media.trailer.site === "youtube" && (
                  <View className="mb-8 w-full bg-slate-900">
                     <YoutubePlayer
                        height={220}
                        play={playing}
                        videoId={data.Media.trailer.id}
                        onChangeState={onStateChange}
                        webViewProps={{
                           allowsFullscreenVideo: true,
                        }}
                     />
                  </View>
               )}

               {/* characters */}
               <View>
                  <Text className="mb-2 text-lg font-semibold text-white">Characters</Text>
                  <FlashList
                     data={data.Media.characters.edges}
                     className="mb-6"
                     horizontal
                     renderItem={({ item }) => (
                        <CharacterCard
                           id={item.node.id}
                           name={item.node.name.full}
                           image={item.node.image.large}
                           role={item.role}
                        />
                     )}
                  />
               </View>

               {/* relations */}
               <View>
                  <Text className="mb-2 text-lg font-semibold text-white">Relations</Text>
                  <FlashList
                     data={data.Media.relations.edges}
                     className="mb-6"
                     horizontal
                     renderItem={({ item }) => (
                        <RelationCard
                           id={item.node.id}
                           relationType={item.relationType}
                           type={item.node.type}
                           title={item.node.title.english || item.node.title.romaji}
                           image={item.node.coverImage.large}
                        />
                     )}
                  />
               </View>

               {/* recommendations */}
               <View>
                  <Text className="mb-2 text-lg font-semibold text-white">Recommendations</Text>
                  <FlashList
                     data={data.Media.recommendations.nodes}
                     className="mb-6"
                     horizontal
                     renderItem={({ item }) => (
                        <RecommendationCard
                           id={item.mediaRecommendation.id}
                           type={item.mediaRecommendation.type}
                           title={
                              item.mediaRecommendation.title.english ||
                              item.mediaRecommendation.title.romaji
                           }
                           image={item.mediaRecommendation.coverImage.large}
                        />
                     )}
                  />
               </View>

               <View className="mb-20"></View>
            </View>
         </ScrollView>
      </View>
   );
};

export default Anime;
