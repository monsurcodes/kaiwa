import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface RelationCardProps {
   id: number;
   relationType: string;
   type: string;
   format: string;
   title: string;
   image: string;
}

const RelationCard = ({ id, relationType, type, format, title, image }: RelationCardProps) => {
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
               cachePolicy="disk"
               transition={100}
               recyclingKey={id.toString()}
            />
         ) : (
            <View className="h-[200] w-[150] rounded-lg bg-slate-800" />
         )}
         {format && (
            <Text className="absolute left-2 top-2 rounded-md bg-slate-900/70 px-2 py-1 text-[11px] font-medium text-white">
               {format.split("_").join(" ")}
            </Text>
         )}
         <View className="flex-1 items-center px-2">
            <Text className="mt-2 text-center text-white" numberOfLines={2}>
               {title}
            </Text>
            <Text className="mt-1 text-sm text-gray-400">{relationType.split("_").join(" ")}</Text>
         </View>
      </Pressable>
   );
};

export default RelationCard;
