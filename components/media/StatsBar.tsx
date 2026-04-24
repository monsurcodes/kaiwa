import { Text, View } from "react-native";

import { SharedMedia } from "@/types";

interface StatsBarProps {
   media: SharedMedia | null | undefined;
}

const StatsBar = ({ media }: StatsBarProps) => {
   return (
      <View className="mx-auto h-16 w-3/4 flex-row items-center justify-around rounded-b-md bg-slate-900/70 px-2 py-1">
         <View className="flex items-center gap-2">
            <Text className="text-white">{media?.averageScore}</Text>
            <Text className="text-sm font-semibold text-white">Score</Text>
         </View>

         <View className="h-[30px] w-[1px] bg-gray-400/50" />

         <View className="flex items-center gap-2">
            <Text className="text-white">{media?.favourites}</Text>
            <Text className="text-sm font-semibold text-white">Favourites</Text>
         </View>

         <View className="h-[30px] w-[1px] bg-gray-400/50" />

         <View className="flex items-center gap-2">
            <Text className="text-white">{media?.popularity}</Text>
            <Text className="text-sm font-semibold text-white">Popularity</Text>
         </View>
      </View>
   );
};

export default StatsBar;
