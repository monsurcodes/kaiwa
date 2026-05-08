import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Heart, Star } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { MediaListStatus } from "@/shared/lib/graphql/generated/graphql";

interface SearchTrendingMediaCardProps {
   id: number;
   title: string;
   image: string;
   format: string;
   score: number;
   favourites: number;
   seasonYear: number;
   episodes?: number | null;
   chapters?: number | null;
   genres: string[];
   type: string;
   status: MediaListStatus | null | undefined;
}

export const SearchTrendingMediaCard = ({
   id,
   title,
   image,
   format,
   score,
   favourites,
   seasonYear,
   episodes,
   chapters,
   genres,
   type,
   status,
}: SearchTrendingMediaCardProps) => {
   const router = useRouter();
   const [genreRowWidth, setGenreRowWidth] = useState(0);
   const displayEpisodes =
      type === "ANIME"
         ? `${episodes ? `${episodes} episodes` : ""}`
         : `${chapters ? `${chapters} chapters` : ""}`;

   const visibleGenres = useMemo(() => {
      if (!genreRowWidth) return [];

      const gapWidth = 8;
      let usedWidth = 0;

      return genres.filter((genre) => {
         const estimatedChipWidth = Math.ceil(genre.length * 8 + 24);
         const nextWidth =
            usedWidth === 0 ? estimatedChipWidth : usedWidth + gapWidth + estimatedChipWidth;

         if (nextWidth > genreRowWidth) return false;

         usedWidth = nextWidth;
         return true;
      });
   }, [genreRowWidth, genres]);

   const handleOnPress = () => {
      if (type === "ANIME") {
         router.push(`/anime/${id}`);
      } else if (type === "MANGA") {
         router.push(`/manga/${id}`);
      }
   };

   let statusTextColor;
   switch (status) {
      case MediaListStatus.Current:
         statusTextColor = "text-green-400";
         break;
      case MediaListStatus.Repeating:
         statusTextColor = "text-green-400";
         break;
      case MediaListStatus.Planning:
         statusTextColor = "text-blue-400";
         break;
      case MediaListStatus.Completed:
         statusTextColor = "text-purple-400";
         break;
      case MediaListStatus.Dropped:
         statusTextColor = "text-red-400";
         break;
      case MediaListStatus.Paused:
         statusTextColor = "text-red-400";
         break;
      default:
         statusTextColor = "text-white-400";
   }

   return (
      <Pressable
         className="mb-4 flex-row overflow-hidden rounded-md bg-[#11212D]/70"
         onPress={handleOnPress}
      >
         {image ? (
            <Image
               source={{ uri: image }}
               style={{
                  width: 120,
                  height: 160,
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
               }}
               contentFit="cover"
               cachePolicy="disk"
               transition={200}
               recyclingKey={id.toString()}
            />
         ) : (
            <View className="h-[160] w-[120] rounded-l-md bg-slate-800" />
         )}
         <View className="min-w-0 flex-1 gap-2 px-4 py-2">
            <Text className="text-[16px] font-medium text-white" numberOfLines={2}>
               {title}
            </Text>

            <Text className="text-[13px] text-white">
               {seasonYear ? `${seasonYear} ●` : null} {format.split("_").join(" ")}{" "}
               {displayEpisodes ? `● ${displayEpisodes}` : null}
            </Text>

            <View className="flex-row items-center gap-4">
               <View className="flex-row items-center justify-center gap-1">
                  <Star color="#ffe840" fill="#ffe840" size={13} />
                  <Text className="text-[14px] text-white">{score}</Text>
               </View>
               <View className="flex-row items-center justify-center gap-1">
                  <Heart color="#ff4d4d" fill="#ff4d4d" size={13} />
                  <Text className="text-[14px] text-white">{favourites}</Text>
               </View>
            </View>

            <View
               className="mt-3 flex-row flex-nowrap overflow-hidden"
               onLayout={(event) => setGenreRowWidth(event.nativeEvent.layout.width)}
            >
               {visibleGenres.map((genre) => (
                  <Text
                     key={`${id}-${genre}`}
                     className="mr-2 rounded-md bg-slate-700 px-1 py-2 text-[14px] text-xs text-white"
                  >
                     {genre}
                  </Text>
               ))}
            </View>
            {status && (
               <View>
                  <Text className={`mt-2 text-sm font-semibold ${statusTextColor}`}>
                     ● {status === MediaListStatus.Current ? "WATCHING" : status}
                  </Text>
               </View>
            )}
         </View>
      </Pressable>
   );
};
