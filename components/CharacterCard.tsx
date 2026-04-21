import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

interface CharacterCardProps {
   id: number;
   name: string;
   image: string;
   role: string;
}

const CharacterCard = ({ id, name, image, role }: CharacterCardProps) => {
   const imageUri = (image || "").trim();

   return (
      <Pressable className="mr-3 h-[170] w-[95] overflow-hidden" onPress={() => {}}>
         {imageUri ? (
            <Image
               source={{ uri: imageUri }}
               style={{ width: 95, height: 120, borderRadius: 6 }}
               contentFit="cover"
               cachePolicy="memory-disk"
            />
         ) : (
            <View className="h-[120] w-[95] rounded-md bg-slate-800" />
         )}
         <View className="flex-1 px-2 py-1">
            <Text className="text-[13px] font-medium text-white" numberOfLines={2}>
               {name}
            </Text>
            <Text className="text-[10px] font-medium text-gray-400">{role}</Text>
         </View>
      </Pressable>
   );
};

export default CharacterCard;
