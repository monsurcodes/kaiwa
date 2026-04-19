import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

import HtmlText from "./HtmlText";

interface TrendingMediaCardProps {
   mediaType: "ANIME" | "MANGA";
   id: number;
   title: string;
   altTitle: string;
   score: number;
   likes: number;
   coverImage: string;
   bannerImage: string;
   description: string;
   genres: string[];
   secondText?: string;
   cardWidth?: number;
}

const TrendingMediaCard = ({
   mediaType,
   id,
   title,
   altTitle,
   score,
   likes,
   coverImage,
   bannerImage,
   description,
   genres,
   secondText,
   cardWidth,
}: TrendingMediaCardProps) => {
   const router = useRouter();
   const heroImageUri = (bannerImage || coverImage || "").trim();
   const posterImageUri = (coverImage || bannerImage || "").trim();

   const handleOnPress = (mediaType: "ANIME" | "MANGA") => {
      if (mediaType === "ANIME") {
         router.push(`/anime/${id}`);
      } else {
         router.push(`/manga/${id}`);
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
                  source={{ uri: heroImageUri }}
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
                           source={{ uri: posterImageUri }}
                           style={{
                              marginRight: 8,
                              width: 112,
                              height: 160,
                              borderRadius: 6,
                           }}
                           contentFit="cover"
                           cachePolicy="memory-disk"
                        />
                     ) : (
                        <View className="mr-2 h-40 w-28 rounded-md bg-slate-800" />
                     )}
                  </View>
                  <View className="flex-1 pb-1">
                     <Text className="text-lg font-bold leading-tight text-white">
                        {title || altTitle}
                     </Text>

                     {secondText && (
                        <Text className="mb-1 font-medium text-white">{secondText}</Text>
                     )}

                     <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center">
                           <Text className="text-white">⭐ {score}</Text>
                        </View>
                        <View className="flex-row items-center">
                           <Text className="text-white">❤️ {likes}</Text>
                        </View>
                     </View>
                  </View>
               </View>
            </LinearGradient>
         </View>

         <View className="px-2">
            {genres.length > 0 && (
               <View className="my-2 flex-row flex-wrap gap-1">
                  {genres.slice(0, 5).map((genre) => (
                     <View key={genre} className="rounded-md bg-slate-700 px-2 py-1">
                        <Text className="text-xs text-white">{genre}</Text>
                     </View>
                  ))}
               </View>
            )}
            <HtmlText htmlContent={description} textColor="white" numberOfLines={6} />
         </View>
      </Pressable>
   );
};

export default TrendingMediaCard;
