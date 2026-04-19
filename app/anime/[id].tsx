import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
   ActivityIndicator,
   LayoutAnimation,
   Platform,
   Pressable,
   Text,
   UIManager,
   View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "urql";

import CharacterCard from "@/components/CharacterCard";
import HtmlText from "@/components/HtmlText";
import RecommendationCard from "@/components/RecommendationCard";
import RelationCard from "@/components/RelationCard";
import TrailerCard from "@/components/TrailerCard";
import { GetAnimeByIdQuery } from "@/lib/graphql/queries/getAnimeById";
import { formatAiringDate } from "@/lib/utils/date";
import { AnimeByIdInterface } from "@/types/animeByIdInterface";

const isNewArchitectureEnabled = Boolean(
   (global as typeof globalThis & { nativeFabricUIManager?: unknown }).nativeFabricUIManager,
);

// Enable LayoutAnimation for Android (Required for smooth transitions)
if (
   Platform.OS === "android" &&
   !isNewArchitectureEnabled &&
   UIManager.setLayoutAnimationEnabledExperimental
) {
   UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Anime = () => {
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
                  style={{
                     position: "absolute",
                     top: 0,
                     right: 0,
                     bottom: 0,
                     left: 0,
                     width: "100%",
                     height: "100%",
                  }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
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
                           style={{
                              marginRight: 8,
                              width: 112,
                              height: 160,
                              borderRadius: 6,
                           }}
                           contentFit="cover"
                           cachePolicy="memory-disk"
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
                     <HtmlText
                        htmlContent={data.Media.description ?? ""}
                        numberOfLines={isExpanded ? undefined : 4}
                     />

                     <Text className="mt-1 text-xs font-bold text-white">
                        {isExpanded ? "Show Less" : "Read More..."}
                     </Text>
                  </Pressable>
               </View>

               {/* youtube trailer */}
               {data.Media.trailer && data.Media.trailer.site === "youtube" && (
                  <TrailerCard videoId={data.Media.trailer.id} />
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
