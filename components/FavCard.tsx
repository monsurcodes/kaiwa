import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

interface FavCardProps {
   id: number;
   title: string;
   image: string;
   type: "anime" | "manga" | "character" | "staff" | "studio";
}

const FavCard = ({ id, title, image, type }: FavCardProps) => {
   const router = useRouter();

   const handleOnPress = (type: FavCardProps["type"]) => {
      if (type === "anime") {
         router.push(`/anime/${id}`);
      } else if (type === "manga") {
         router.push(`/manga/${id}`);
      } else if (type === "character") {
         console.log("Character card pressed with id:", id);
      } else if (type === "staff") {
         console.log("Staff card pressed with id:", id);
      } else if (type === "studio") {
         console.log("Studio card pressed with id:", id);
      }
   };

   return (
      <Pressable
         onPress={() => handleOnPress(type)}
         className="mr-3 h-[240] w-[150] overflow-hidden"
      >
         <Image
            source={{ uri: image }}
            style={{ width: 150, height: 200, borderRadius: 8 }}
            contentFit="cover"
            cachePolicy="memory-disk"
         />
         <Text className="px-2 py-1 text-white" numberOfLines={2}>
            {title}
         </Text>
      </Pressable>
   );
};

export default FavCard;
