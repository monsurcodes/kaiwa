import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface RelationCardProps {
   id: number;
   relationType: string;
   type: string;
   title: string;
   image: string;
}

const RelationCard = ({ id, relationType, type, title, image }: RelationCardProps) => {
   const router = useRouter();
   const imageUri = (image || "").trim();

   const handleOnPress = (mediaType: string) => {
      if (mediaType === "ANIME") {
         router.push(`/anime/${id}`);
      } else {
         router.push(`/manga/${id}`);
      }
   };

   return (
      <Pressable
         className="mr-3 h-[260] w-[150] overflow-hidden"
         onPress={() => handleOnPress(type)}
      >
         {imageUri ? (
            <Image
               source={{ uri: imageUri }}
               style={{ width: 150, height: 200, borderRadius: 8 }}
               contentFit="cover"
               cachePolicy="memory-disk"
            />
         ) : (
            <View className="h-[200] w-[150] rounded-lg bg-slate-800" />
         )}
         <Text className="absolute left-2 top-2 rounded-sm bg-slate-900/70 px-1 text-[11px] text-white">
            {type}
         </Text>
         <View className="flex-1 items-center px-2">
            <Text className="mt-1 text-white" numberOfLines={2}>
               {title}
            </Text>
            <Text className="mt-2 text-sm text-gray-400">{relationType.split("_").join(" ")}</Text>
         </View>
      </Pressable>
   );
};

export default RelationCard;
