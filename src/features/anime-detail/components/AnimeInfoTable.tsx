import { Text, View } from "react-native";

import { getMonth } from "@/shared/lib/utils/date";

import { AnimeMedia } from "../types";

interface AnimeInfoTableProps {
   media: AnimeMedia | null | undefined;
}

export const AnimeInfoTable = ({ media }: AnimeInfoTableProps) => {
   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-white">Info</Text>
         <View className="mb-2 gap-2 rounded-md bg-slate-900/70 px-4 py-2">
            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">Format</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">{media?.format}</Text>
               </View>
            </View>

            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">Episodes</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">{media?.episodes ?? "?"}</Text>
               </View>
            </View>

            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">Episode Duration</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">
                     {media?.duration ? `${media?.duration} minutes` : "?"}
                  </Text>
               </View>
            </View>

            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">Source</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">{media?.source?.split("_").join(" ")}</Text>
               </View>
            </View>

            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">Status</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">{media?.status?.split("_").join(" ")}</Text>
               </View>
            </View>

            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">Start Date</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">
                     {media?.startDate?.year ? media?.startDate?.year : "?"}{" "}
                     {getMonth(media?.startDate?.month ?? 0)} {media?.startDate?.day}
                  </Text>
               </View>
            </View>

            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">End Date</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">
                     {media?.endDate?.year ? media?.endDate?.year : "?"}{" "}
                     {getMonth(media?.endDate?.month ?? 0)} {media?.endDate?.day}
                  </Text>
               </View>
            </View>

            <View className="flex-row">
               <View className="w-1/2">
                  <Text className="text-white">Season</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">
                     {media?.season ? media?.season : "?"} {media?.startDate?.year}
                  </Text>
               </View>
            </View>
         </View>

         <View className="gap-2 rounded-md bg-slate-900/70 px-4 py-2">
            {media?.studios?.edges?.some((studio) => studio?.isMain) && (
               <View className="flex-row">
                  <View className="w-1/2">
                     <Text className="text-white">Studio</Text>
                  </View>
                  <View className="w-1/2">
                     {(media?.studios?.edges ?? [])
                        .filter(
                           (
                              studio,
                           ): studio is NonNullable<
                              NonNullable<
                                 NonNullable<NonNullable<typeof media>["studios"]>["edges"]
                              >[number]
                           > => Boolean(studio?.isMain && studio?.node),
                        )
                        .map((studio) => (
                           <Text key={studio.id} className="text-white">
                              {studio?.node?.name}
                           </Text>
                        ))}
                  </View>
               </View>
            )}

            {media?.studios?.edges?.some((studio) => !studio?.node?.isAnimationStudio) && (
               <View className="flex-row">
                  <View className="w-1/2">
                     <Text className="text-white">Producers</Text>
                  </View>
                  <View className="w-1/2">
                     {(media?.studios?.edges ?? [])
                        .filter(
                           (
                              studio,
                           ): studio is NonNullable<
                              NonNullable<
                                 NonNullable<NonNullable<typeof media>["studios"]>["edges"]
                              >[number]
                           > => Boolean(studio?.node && !studio.node.isAnimationStudio),
                        )
                        .map((studio) => (
                           <Text key={studio.id} className="text-white">
                              {studio?.node?.name}
                           </Text>
                        ))}
                  </View>
               </View>
            )}
         </View>
      </View>
   );
};
