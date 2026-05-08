import { Text, View } from "react-native";

import { getMonth } from "@/shared/lib/utils/date";

import { MangaMedia } from "../types";

interface MangaInfoTableProps {
   media: MangaMedia | null | undefined;
}

export const MangaInfoTable = ({ media }: MangaInfoTableProps) => {
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
                  <Text className="text-white">Chapters</Text>
               </View>
               <View className="w-1/2">
                  <Text className="text-white">{media?.chapters ?? "?"}</Text>
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
         </View>

         {media?.externalLinks && media.externalLinks.length > 0 && (
            <View className="mb-6 gap-2 rounded-md bg-slate-900/70 px-4 py-2">
               <View className="flex-row">
                  <View className="w-1/2">
                     <Text className="text-white">Serializations</Text>
                  </View>
                  <View className="w-1/2">
                     <Text className="text-white">{media?.externalLinks[0]?.site}</Text>
                  </View>
               </View>
            </View>
         )}
      </View>
   );
};
