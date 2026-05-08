import { EyeOff } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface TagCardProps {
   id: number;
   name: string;
   description: string;
   rank: number;
   spoiler: boolean;
   isRevealed?: boolean;
   onReveal?: (id: number) => void;
}

export const TagCard = ({
   id,
   name,
   description,
   rank,
   spoiler,
   isRevealed,
   onReveal,
}: TagCardProps) => {
   const showSpoiler = spoiler && !isRevealed;

   const handleOnPress = () => {
      if (spoiler && onReveal) {
         onReveal(id);
      }
   };

   return (
      <Pressable
         className="mr-2 self-start rounded-md bg-red-400"
         style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: spoiler ? "#f87171" : "rgb(15 23 42 / 0.7)",
         }}
         onPress={handleOnPress}
         accessibilityLabel={`Tag ${name}`}
      >
         <View className="flex-row items-center gap-1">
            {showSpoiler && <EyeOff color="white" size={14} />}

            <Text className="text-sm text-white" numberOfLines={1}>
               {showSpoiler ? "Spoiler" : name}
            </Text>

            {!showSpoiler && <Text className="text-sm text-white">{rank}%</Text>}
         </View>
      </Pressable>
   );
};
