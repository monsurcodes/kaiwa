import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface RecommendationCardProps {
   id: number;
   type: string;
   title: string;
   image: string;
}

const RecommendationCard = ({ id, type, title, image }: RecommendationCardProps) => {
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
         onPress={() => handleOnPress(type)}
         className="mr-3 h-[240] w-[150] overflow-hidden"
      >
         <Image source={{ uri: image }} className="h-[200] w-[150] rounded-md" />
         <View className="mt-1 px-2 py-1">
            <Text className="text-white" numberOfLines={2}>
               {title}
            </Text>
         </View>
      </Pressable>
   );
};

export default RecommendationCard;
