import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface CharacterCardProps {
   id: number;
   name: string;
   image: string;
   role: string;
}

const CharacterCard = ({ id, name, image, role }: CharacterCardProps) => {
   return (
      <Pressable
         className="mr-3 h-[170] w-[95] overflow-hidden"
         onPress={() => console.log(`Character ID: ${id}`)}
      >
         <Image source={{ uri: image }} className="h-[120] w-[95] rounded-md" />
         <View className="flex-1 px-2 py-1">
            <Text className="text-[13px] font-medium text-white">{name}</Text>
            <Text className="text-[10px] font-medium text-gray-400">{role}</Text>
         </View>
      </Pressable>
   );
};

export default CharacterCard;
