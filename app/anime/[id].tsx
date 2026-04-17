import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "urql";

import CharacterCard from "@/components/CharacterCard";
import RelationCard from "@/components/RelationCard";
import { GetAnimeByIdQuery } from "@/lib/graphql/queries/getAnimeById";
import { formatAiringDate } from "@/lib/utils/date";
import { AnimeByIdInterface } from "@/types/animeByIdInterface";

const Anime = () => {
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
                  source={{ uri: data.Media.bannerImage || data.Media.coverImage.large }}
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
                           source={{ uri: data.Media.coverImage.large || data.Media.bannerImage }}
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
               {/* characters */}
               <View>
                  <Text className="mb-2 text-lg font-semibold text-white">Characters</Text>
                  <FlashList
                     data={data.Media.characters.edges}
                     horizontal
                     style={{ width: "100%", height: 200 }}
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
                     horizontal
                     style={{ width: "100%", height: 270 }}
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
            </View>
         </ScrollView>
      </View>
   );
};

export default Anime;
