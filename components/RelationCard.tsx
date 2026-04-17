import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface RelationCardProps {
   id: number;
   relationType: string;
   type: string;
   title: string;
   image: string;
}

const RelationCard = ({ id, relationType, type, title, image }: RelationCardProps) => {
   const router = useRouter();
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
         <Image source={{ uri: image }} className="relative h-[200] w-[150] rounded-lg" />
         <Text className="absolute left-2 top-2 rounded-sm bg-slate-900/70 px-1 text-[11px] text-white">
            {type}
         </Text>
         <View className="flex-1 items-center px-2">
            <Text className="mt-1 text-white" numberOfLines={2}>
               {title}
            </Text>
            <Text className="mt-2 text-sm text-gray-400">{relationType}</Text>
         </View>
      </Pressable>
   );
};

export default RelationCard;
