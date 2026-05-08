import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { getTimestampDayLabel } from "@/shared/lib/utils/date";

type ReleasingTodayItem = {
   progress?: number | null;
   media?: {
      id: number | null;
      title?: {
         english?: string | null;
         romaji?: string | null;
      } | null;
      coverImage?: {
         large?: string | null;
      } | null;
      episodes?: number | null;
      nextAiringEpisode?: {
         episode?: number | null;
         airingAt?: number | null;
      } | null;
   } | null;
};

interface ReleasingTodayCardProps {
   item: ReleasingTodayItem | null | undefined;
}

export const ReleasingTodayCard = ({ item }: ReleasingTodayCardProps) => {
   const router = useRouter();
   const handleOnPress = () => {
      router.push(`/anime/${item?.media?.id ?? 0}`);
   };

   return (
      <Pressable
         onPress={handleOnPress}
         className="relative mr-3 overflow-hidden rounded-md"
         style={{ width: 100, height: 150 }}
      >
         <Image
            source={{ uri: item?.media?.coverImage?.large ?? "" }}
            style={{ width: 100, height: 150 }}
         />
         <View className="absolute inset-0 justify-between bg-black/25 px-1 py-1">
            <View
               style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  width: "100%",
               }}
            >
               <Text className="text-[11px] text-accent-light" numberOfLines={1}>
                  {item?.media?.title?.english ?? item?.media?.title?.romaji ?? "Unknown Title"}
               </Text>
            </View>

            <View
               style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  width: "100%",
               }}
            >
               <Text className="text-[10px] text-white" numberOfLines={1}>
                  EP {item?.media?.nextAiringEpisode?.episode} on{" "}
                  {getTimestampDayLabel(item?.media?.nextAiringEpisode?.airingAt)}
               </Text>
               <Text className="text-[10px] text-white" numberOfLines={1}>
                  {item?.progress} / {item?.media?.episodes ?? "?"}
               </Text>
            </View>
         </View>
      </Pressable>
   );
};
