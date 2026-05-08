import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

import { formatAiringDate } from "@/shared/lib/utils/date";

import { AnimeMedia } from "../types";

interface AnimeHeroBannerProps {
   media: AnimeMedia | null | undefined;
}

export const AnimeHeroBanner = ({ media }: AnimeHeroBannerProps) => {
   return (
      <View className="relative h-64">
         <Image
            source={{
               uri: media?.bannerImage ?? media?.coverImage?.extraLarge ?? "",
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
                        uri: media?.coverImage?.extraLarge ?? media?.bannerImage ?? "",
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
                  <Text className="text-lg font-bold leading-tight text-text-primary">
                     {media?.title?.english ??
                        media?.title?.romaji ??
                        media?.title?.native ??
                        "Title Not Available"}
                  </Text>

                  <Text className="text-xs font-medium text-text-secondary">
                     {media?.startDate?.year}
                  </Text>

                  <Text className="text-sm font-semibold text-text-secondary">
                     {media?.format} • {media?.episodes} episodes
                  </Text>

                  {media?.nextAiringEpisode && (
                     <Text className="mt-2 text-sm text-accent-light">
                        ● EP {media.nextAiringEpisode.episode} on{" "}
                        {formatAiringDate(media.nextAiringEpisode.airingAt ?? 0)}{" "}
                     </Text>
                  )}
               </View>
            </View>
         </LinearGradient>
      </View>
   );
};
