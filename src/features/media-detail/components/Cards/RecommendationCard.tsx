import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

// TODO: add likes and averageScore to the card UI.

interface RecommendationCardProps {
   id: number;
   type: string;
   title: string;
   image: string;
}

export const RecommendationCard = ({ id, type, title, image }: RecommendationCardProps) => {
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
         onPress={() => handleOnPress(type)}
         className="mr-3 h-[240] w-[150] overflow-hidden"
      >
         {imageUri ? (
            <Image
               source={{ uri: imageUri }}
               style={{ width: 150, height: 200, borderRadius: 6 }}
               contentFit="cover"
               cachePolicy="disk"
               transition={100}
               recyclingKey={id.toString()}
            />
         ) : (
            <View className="h-[200] w-[150] rounded-md bg-slate-800" />
         )}
         <View className="mt-1 px-2 py-1">
            <Text className="text-center text-white" numberOfLines={2}>
               {title}
            </Text>
         </View>
      </Pressable>
   );
};
