import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Heart, Star } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PopularAnimeMedia, TrendingAnimeMedia, TrendingMangaMedia } from "@/types";

import HtmlText from "./ui/HtmlText";

interface TrendingMediaCardProps {
   media: HomeTrendingMediaItem | null | undefined;
   mediaType: "ANIME" | "MANGA";
   cardWidth?: number;
}

type HomeTrendingMediaItem =
   | NonNullable<TrendingAnimeMedia[number]>
   | NonNullable<PopularAnimeMedia[number]>
   | NonNullable<TrendingMangaMedia[number]>;

const TrendingMediaCard = ({ media, mediaType, cardWidth }: TrendingMediaCardProps) => {
   const router = useRouter();
   const heroImageUri = media?.bannerImage || media?.coverImage || "";
   const posterImageUri = media?.coverImage || media?.bannerImage || "";
   const studioName = media && "studios" in media ? media.studios?.nodes?.[0]?.name : undefined;

   const handleOnPress = (mediaType: "ANIME" | "MANGA") => {
      if (mediaType === "ANIME") {
         router.push(`/anime/${media?.id}`);
      } else {
         router.push(`/manga/${media?.id}`);
      }
   };
   return (
      <Pressable
         style={{ width: cardWidth }}
         className="mr-4 overflow-hidden rounded-lg bg-slate-900"
         onPress={() => handleOnPress(mediaType)}
      >
         <View className="relative h-60">
            {heroImageUri ? (
               <Image
                  source={{ uri: media?.bannerImage ?? media?.coverImage?.large ?? "" }}
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
                  recyclingKey={`banner-${media?.id}`}
               />
            ) : (
               <View className="absolute inset-0 bg-slate-800" />
            )}

            <LinearGradient
               colors={["transparent", "rgba(0,0,0,0.9)"]}
               className="absolute inset-0 flex-col justify-end p-3"
            >
               <View className="flex-row items-end">
                  <View className="shadow-lg">
                     {posterImageUri ? (
                        <Image
                           source={{ uri: media?.coverImage?.large ?? media?.bannerImage ?? "" }}
                           style={{
                              marginRight: 8,
                              width: 112,
                              height: 160,
                              borderRadius: 6,
                           }}
                           contentFit="cover"
                           cachePolicy="disk"
                           transition={100}
                           recyclingKey={`poster-${media?.id}`}
                        />
                     ) : (
                        <View className="mr-2 h-40 w-28 rounded-md bg-slate-800" />
                     )}
                  </View>
                  <View className="flex-1 pb-1">
                     <Text className="text-lg font-bold leading-tight text-white">
                        {media?.title?.english || media?.title?.romaji || ""}
                     </Text>

                     {studioName && (
                        <Text className="mb-1 font-medium text-white">{studioName}</Text>
                     )}

                     <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center justify-center gap-1">
                           <Star color="#ffe840" fill="#ffe840" size={13} />
                           <Text className="text-white">{media?.averageScore}</Text>
                        </View>
                        <View className="flex-row items-center justify-center gap-1">
                           <Heart color="#ff4d4d" fill="#ff4d4d" size={13} />
                           <Text className="text-white">{media?.favourites}</Text>
                        </View>
                     </View>
                  </View>
               </View>
            </LinearGradient>
         </View>

         <View className="px-2">
            {(media?.genres ?? []).length > 0 && (
               <View className="my-2 flex-row flex-wrap gap-1">
                  {(media?.genres ?? []).slice(0, 5).map((genre) => (
                     <View key={genre} className="rounded-md bg-slate-700 px-2 py-1">
                        <Text className="text-xs text-white">{genre}</Text>
                     </View>
                  ))}
               </View>
            )}
            <HtmlText htmlContent={media?.description ?? ""} textColor="white" numberOfLines={6} />
         </View>
      </Pressable>
   );
};

export default TrendingMediaCard;
