import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { formatAiringDate } from "@/lib/utils/date";

interface LibraryMediaCardProps {
   id: number | null | undefined;
   title: string | null | undefined;
   image: string | null | undefined;
   episodes?: number | null | undefined;
   chapters?: number | null | undefined;
   format: string | null | undefined;
   type: string | null | undefined;
   progress: number | null | undefined;
   status: string | null | undefined;
   nextAiringEpisode?: number | null | undefined;
   nextAiringAt?: number | null | undefined;
}

const LibraryMediaCard = ({
   id,
   title,
   image,
   episodes,
   chapters,
   format,
   type,
   progress,
   status,
   nextAiringAt,
   nextAiringEpisode,
}: LibraryMediaCardProps) => {
   const router = useRouter();

   // 1. Calculate Progress Percentage
   const totalCount = episodes ?? chapters ?? 0;
   const currentProgress = progress ?? 0;
   const progressPercentage = totalCount > 0 ? (currentProgress / totalCount) * 100 : 0;

   const handleOnPress = () => {
      if (type === "ANIME") {
         router.push(`/anime/${id}`);
      } else if (type === "MANGA") {
         router.push(`/manga/${id}`);
      }
   };

   return (
      <Pressable
         onPress={handleOnPress}
         className="mb-4 flex-row overflow-hidden rounded-md bg-[#11212D]/70"
      >
         {image ? (
            <Image
               source={{ uri: image }}
               style={{
                  width: 100,
                  height: 140,
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
               }}
               contentFit="cover"
               cachePolicy="disk"
               transition={200}
               recyclingKey={id?.toString()}
            />
         ) : (
            <View className="h-[140] w-[100] rounded-l-md bg-slate-800" />
         )}

         <View className="min-w-0 flex-1 justify-between px-4 py-2">
            <View className="flex gap-3">
               <Text className="text-[16px] font-medium text-white" numberOfLines={2}>
                  {title ?? "Title Unavailable"}
               </Text>
               <View className="flex-row items-center gap-2">
                  <Text className="text-[13px] text-white">{format?.split("_").join(" ")}</Text>
                  {nextAiringAt && <Text className="text-accent-light">●</Text>}
                  {nextAiringAt && (
                     <Text className="text-sm text-accent-light">
                        EP {nextAiringEpisode} on {formatAiringDate(nextAiringAt)}
                     </Text>
                  )}
               </View>
               {typeof nextAiringEpisode === "number" &&
               typeof progress === "number" &&
               progress < nextAiringEpisode - 1 ? (
                  <Text className="text-sm font-semibold text-accent-light">
                     {nextAiringEpisode - progress - 1} EP BEHIND
                  </Text>
               ) : (
                  <Text></Text>
               )}
            </View>

            <View className="flex gap-2 px-2">
               <View className="flex-row items-end justify-between">
                  <Text></Text>
                  <Text className="text-sm text-text-secondary">
                     {progress} / {episodes ?? chapters ?? "?"}
                  </Text>
               </View>
            </View>
            <View className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
               <View
                  className="h-full bg-accent"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
               />
            </View>
         </View>
      </Pressable>
   );
};

export default LibraryMediaCard;
