import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EllipsisVertical, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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
import type { GetMediaCharactersQuery as GetMediaCharactersData } from "@/lib/graphql/generated/graphql";
import { GetMangaByIdQuery } from "@/lib/graphql/queries/getMangaById";
import { GetMediaCharactersQuery } from "@/lib/graphql/queries/getMediaCharacters";
import { getMonth } from "@/lib/utils/date";

type CharacterEdge = NonNullable<
   NonNullable<
      NonNullable<NonNullable<GetMediaCharactersData["Media"]>["characters"]>["edges"]
   >[number]
>;

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

const Manga = () => {
   const router = useRouter();
   const [revealedTagIds, setRevealedTagIds] = useState<number[]>([]);

   // close button and option button handlers
   // TODO: Takes more time to close the screen than direct back button navigation. Optimize by using a custom animation or using native navigation pop if possible.
   const handleScreenClose = () => {
      router.replace("/(tabs)");
   };

   const handleOptionPress = () => {
      // Implement option button logic, e.g., show action sheet
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

   // data fetching
   const { id } = useLocalSearchParams<{ id?: string | string[] }>();
   const mediaId = useMemo(() => {
      const rawId = Array.isArray(id) ? id[0] : id;
      const parsedId = Number(rawId);
      return Number.isFinite(parsedId) ? parsedId : null;
   }, [id]);

   const [manga] = useQuery({
      query: GetMangaByIdQuery,
      variables: {
         mediaId: mediaId ?? 0,
      },
      pause: mediaId === null,
   });
   const { data, fetching, error } = manga;

   // character states
   const [charactersPage, setCharactersPage] = useState(1);
   const [allCharacters, setAllCharacters] = useState<CharacterEdge[]>([]);

   const [characters] = useQuery({
      query: GetMediaCharactersQuery,
      variables: {
         mediaId: mediaId ?? 0,
         page: charactersPage,
      },
      pause: mediaId === null,
   });
   const {
      data: charactersData,
      fetching: fetchingCharacters,
      error: charactersError,
   } = characters;

   useEffect(() => {
      // Route param changes can reuse this screen instance; reset pagination + list for new media.
      setCharactersPage(1);
      setAllCharacters([]);
   }, [mediaId]);

   useEffect(() => {
      const nextEdges = (charactersData?.Media?.characters?.edges ?? []).filter(
         (edge): edge is CharacterEdge => Boolean(edge),
      );

      if (charactersPage === 1) {
         setAllCharacters(nextEdges);
         return;
      }

      if (!nextEdges.length) return;

      setAllCharacters((prev) => {
         const existingIds = new Set(prev.map((edge) => edge.node?.id));
         const merged = [...prev];

         for (const edge of nextEdges) {
            const characterId = edge.node?.id;
            if (existingIds.has(characterId)) continue;
            existingIds.add(characterId);
            merged.push(edge);
         }

         return merged;
      });
   }, [charactersData, charactersPage]);

   const loadMoreCharacters = () => {
      if (!fetchingCharacters && charactersData?.Media?.characters?.pageInfo?.hasNextPage) {
         setCharactersPage((prev) => prev + 1);
      }
   };

   if (charactersError) console.error("Error fetching characters data:", charactersError);

   if (error) console.error("Error fetching manga data:", error);

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
                  source={{
                     uri: data?.Media?.bannerImage ?? data?.Media?.coverImage?.extraLarge ?? "",
                  }}
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
                  cachePolicy="disk"
                  transition={100}
               />

               <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.9)"]}
                  className="absolute inset-0 flex-col justify-end p-3"
               >
                  <View className="flex-row items-end">
                     <View className="shadow-lg">
                        <Image
                           source={{
                              uri:
                                 data?.Media?.coverImage?.extraLarge ??
                                 data?.Media?.bannerImage ??
                                 "",
                           }}
                           style={{
                              marginRight: 8,
                              width: 112,
                              height: 160,
                              borderRadius: 6,
                           }}
                           contentFit="cover"
                           cachePolicy="disk"
                           transition={100}
                        />
                     </View>
                     <View className="flex-1 gap-1 pb-1">
                        <Text className="text-lg font-bold leading-tight text-white">
                           {data?.Media?.title?.english ??
                              data?.Media?.title?.romaji ??
                              data?.Media?.title?.native ??
                              "Title Not Available"}
                        </Text>

                        <Text className="text-xs text-white">{data?.Media?.startDate?.year}</Text>

                        <Text className="text-xs font-semibold text-white">
                           {data?.Media?.format}
                        </Text>
                     </View>
                  </View>
               </LinearGradient>
            </View>

            <View className="flex-1 p-4">
               <View className="mx-auto mb-4 h-16 w-3/4 flex-row items-center justify-around rounded-md bg-slate-900/70 px-2 py-1">
                  <View className="flex items-center gap-2">
                     <Text className="text-white">{data?.Media?.averageScore}</Text>
                     <Text className="text-sm font-semibold text-white">Score</Text>
                  </View>

                  <View className="h-[30px] w-[1px] bg-gray-400/50" />

                  <View className="flex items-center gap-2">
                     <Text className="text-white">{data?.Media?.favourites}</Text>
                     <Text className="text-sm font-semibold text-white">Favourites</Text>
                  </View>

                  <View className="h-[30px] w-[1px] bg-gray-400/50" />

                  <View className="flex items-center gap-2">
                     <Text className="text-white">{data?.Media?.popularity}</Text>
                     <Text className="text-sm font-semibold text-white">Popularity</Text>
                  </View>
               </View>

               {/* genres */}
               <FlashList
                  data={data?.Media?.genres}
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
                        htmlContent={data?.Media?.description ?? ""}
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
                     key={`characters-${mediaId ?? "unknown"}`}
                     data={allCharacters}
                     className="mb-6"
                     style={{ height: 185 }}
                     horizontal
                     keyExtractor={(item, index) =>
                        item.node?.id ? item.node.id.toString() : `character-${index}`
                     }
                     renderItem={({ item }) => (
                        <CharacterCard
                           id={item?.node?.id ?? 0}
                           name={item?.node?.name?.full ?? "Name Unavailable"}
                           image={item?.node?.image?.large ?? ""}
                           role={item?.role ?? ""}
                        />
                     )}
                     onEndReached={loadMoreCharacters}
                     onEndReachedThreshold={0.5}
                     ListFooterComponent={
                        fetchingCharacters ? (
                           <View className="flex h-[120] w-[40] items-center justify-center">
                              <ActivityIndicator size="small" />
                           </View>
                        ) : null
                     }
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
                           <Text className="text-white">{data?.Media?.format}</Text>
                        </View>
                     </View>

                     {/* chapters */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Chapters</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data?.Media?.chapters ? data?.Media?.chapters : "?"}
                           </Text>
                        </View>
                     </View>

                     {/* source */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Source</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data?.Media?.source?.split("_").join(" ")}
                           </Text>
                        </View>
                     </View>

                     {/* status */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Status</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data?.Media?.status?.split("_").join(" ")}
                           </Text>
                        </View>
                     </View>

                     {/* start date */}
                     <View className="flex-row">
                        <View className="w-1/2">
                           <Text className="text-white">Start Date</Text>
                        </View>
                        <View className="w-1/2">
                           <Text className="text-white">
                              {data?.Media?.startDate?.year ? data?.Media?.startDate?.year : "?"}{" "}
                              {getMonth(data?.Media?.startDate?.month ?? 0)}{" "}
                              {data?.Media?.startDate?.day}
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
                              {data?.Media?.endDate?.year ? data?.Media?.endDate?.year : "?"}{" "}
                              {getMonth(data?.Media?.endDate?.month ?? 0)}{" "}
                              {data?.Media?.endDate?.day}
                           </Text>
                        </View>
                     </View>
                  </View>

                  {data.Media?.externalLinks && data.Media.externalLinks.length > 0 && (
                     <View className="mb-6 gap-2 rounded-md bg-slate-900/70 px-4 py-2">
                        {/* Serializations */}
                        <View className="flex-row">
                           <View className="w-1/2">
                              <Text className="text-white">Serializations</Text>
                           </View>
                           <View className="w-1/2">
                              <Text className="text-white">
                                 {data.Media?.externalLinks[0]?.site}
                              </Text>
                           </View>
                        </View>
                     </View>
                  )}
               </View>

               {/* tags */}
               {data?.Media?.tags && data.Media.tags.length > 0 && (
                  <View>
                     <Text className="mb-2 text-lg font-semibold text-white">Tags</Text>
                     <FlashList
                        data={data?.Media?.tags}
                        className="mb-6"
                        horizontal
                        keyExtractor={(item, index) => item?.id?.toString() ?? `tag-${index}`}
                        renderItem={({ item }) => (
                           <TagCard
                              id={item?.id ?? 0}
                              name={item?.name ?? "Name Unavailable"}
                              description={item?.description ?? "Description Unavailable"}
                              rank={item?.rank ?? 0}
                              spoiler={item?.isMediaSpoiler ?? false}
                              isRevealed={revealedTagIds.includes(item?.id ?? 0)}
                              onReveal={handleRevealTag}
                           />
                        )}
                     />
                  </View>
               )}

               {/* relations */}
               {data.Media?.relations?.edges && data.Media.relations.edges.length > 0 && (
                  <View>
                     <Text className="mb-2 text-lg font-semibold text-white">Relations</Text>
                     <FlashList
                        data={data?.Media?.relations?.edges}
                        className="mb-6"
                        horizontal
                        renderItem={({ item }) => (
                           <RelationCard
                              id={item?.node?.id ?? 0}
                              relationType={item?.relationType ?? ""}
                              type={item?.node?.type ?? ""}
                              format={item?.node?.format ?? ""}
                              title={
                                 item?.node?.title?.english ??
                                 item?.node?.title?.romaji ??
                                 "Title Unavailable"
                              }
                              image={item?.node?.coverImage?.large ?? ""}
                           />
                        )}
                     />
                  </View>
               )}

               {/* youtube trailer */}
               {data?.Media?.trailer && data?.Media?.trailer?.site === "youtube" && (
                  <TrailerCard videoId={data?.Media?.trailer?.id ?? ""} />
               )}

               {/* recommendations */}
               {data.Media?.recommendations?.nodes &&
                  data.Media.recommendations.nodes.length > 0 && (
                     <View>
                        <Text className="mb-2 text-lg font-semibold text-white">
                           Recommendations
                        </Text>
                        <FlashList
                           data={data?.Media?.recommendations?.nodes}
                           className="mb-6"
                           horizontal
                           renderItem={({ item }) => (
                              <RecommendationCard
                                 id={item?.mediaRecommendation?.id ?? 0}
                                 type={item?.mediaRecommendation?.type ?? ""}
                                 title={
                                    item?.mediaRecommendation?.title?.english ??
                                    item?.mediaRecommendation?.title?.romaji ??
                                    "Title Unavailable"
                                 }
                                 image={item?.mediaRecommendation?.coverImage?.large ?? ""}
                              />
                           )}
                        />
                     </View>
                  )}

               <View className="mb-20"></View>
            </View>
         </ScrollView>
      </View>
   );
};

export default Manga;
