import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EllipsisVertical, X } from "lucide-react-native";
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
import TagCard from "@/components/TagCard";
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
   const router = useRouter();
   const [revealedTagIds, setRevealedTagIds] = useState<number[]>([]);

   // close button and option button handlers
   const handleScreenClose = () => {
      router.replace("/(tabs)");
   };

   const handleOptionPress = () => {
      // Implement option button logic, e.g., show action sheet
      console.log("Option button pressed");
   };

   // synopsis expand/collapse
   const [isExpanded, setIsExpanded] = useState(false);

   const toggleExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(!isExpanded);
   };

   const handleRevealTag = (tagId: number) => {
      setRevealedTagIds((current) =>
         current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
      );
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
      <View className="flex-1">
         <View className="absolute left-1 right-1 top-2 z-20 h-10 flex-row items-center justify-between">
            <Pressable className="rounded-full bg-black/55 p-2" onPress={handleScreenClose}>
               <X color="white" size={20} />
            </Pressable>
            <Pressable className="rounded-full bg-black/55 p-2" onPress={handleOptionPress}>
               <EllipsisVertical color="white" size={20} />
            </Pressable>
         </View>

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
               <View className="mb-6">
                  <Text className="mb-2 text-lg font-semibold text-white">Synopsis</Text>
                  <Pressable
                     onPress={toggleExpand}
                     className="rounded-md bg-slate-900/70 px-4 py-2"
                  >
                     <HtmlText
                        htmlContent={data.Media.description ?? ""}
                        numberOfLines={isExpanded ? undefined : 4}
                     />

                     <Text className="mt-1 text-xs font-bold text-white">
                        {isExpanded ? "Show Less" : "Read More..."}
                     </Text>
                  </Pressable>
               </View>

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

               {/* Info */}
               <View className="">
                  <Text className="mb-2 text-lg font-semibold text-white">Info</Text>
                  <View className="mb-2 gap-2 rounded-md bg-slate-900/70 px-4 py-2">
                     {/* format */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Format</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">{data.Media.format}</Text>
                        </View>
                     </View>

                     {/* episodes */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Episodes</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">{data.Media.episodes}</Text>
                        </View>
                     </View>

                     {/* episodes duration */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Episode Duration</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">{data.Media.duration} minutes</Text>
                        </View>
                     </View>

                     {/* source */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Source</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data.Media.source.split("_").join(" ")}
                           </Text>
                        </View>
                     </View>

                     {/* status */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Status</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">{data.Media.status}</Text>
                        </View>
                     </View>

                     {/* start date */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Start Date</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data.Media.startDate.year}-{data.Media.startDate.month}-
                              {data.Media.startDate.day}
                           </Text>
                        </View>
                     </View>

                     {/* end date */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">End Date</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data.Media.endDate.year}-{data.Media.endDate.month}-
                              {data.Media.endDate.day}
                           </Text>
                        </View>
                     </View>

                     {/* season */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Season</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data.Media.season} {data.Media.startDate.year}
                           </Text>
                        </View>
                     </View>
                  </View>

                  <View className="mb-6 gap-2 rounded-md bg-slate-900/70 px-4 py-2">
                     {/* studio */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Studio</Text>
                        </View>
                        <View className="w-1/2">
                           {data.Media.studios.edges
                              .filter((studio) => studio.isMain)
                              .map((studio) => (
                                 <Text key={studio.id} className="text-white">
                                    {studio.node.name}
                                 </Text>
                              ))}
                        </View>
                     </View>

                     {/* producers */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Producers</Text>
                        </View>
                        <View className="w-1/2">
                           {data.Media.studios.edges
                              .filter((studio) => !studio.node.isAnimationStudio)
                              .map((studio) => (
                                 <Text key={studio.id} className="text-white">
                                    {studio.node.name}
                                 </Text>
                              ))}
                        </View>
                     </View>
                  </View>
               </View>

               {/* tags */}
               <View>
                  <Text className="mb-2 text-lg font-semibold text-white">Tags</Text>
                  <FlashList
                     data={data.Media.tags}
                     className="mb-6"
                     horizontal
                     keyExtractor={(item) => item.id.toString()}
                     renderItem={({ item }) => (
                        <TagCard
                           id={item.id}
                           name={item.name}
                           description={item.description}
                           rank={item.rank}
                           spoiler={item.isMediaSpoiler}
                           isRevealed={revealedTagIds.includes(item.id)}
                           onReveal={handleRevealTag}
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

               {/* youtube trailer */}
               {data.Media.trailer && data.Media.trailer.site === "youtube" && (
                  <TrailerCard videoId={data.Media.trailer.id} />
               )}

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
