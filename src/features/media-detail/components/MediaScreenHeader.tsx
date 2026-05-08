import { EllipsisVertical, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface MediaScreenHeaderProps {
   onClosePress: () => void;
   onOptionPress: () => void;
}

export const MediaScreenHeader = ({ onClosePress, onOptionPress }: MediaScreenHeaderProps) => {
   return (
      <View className="absolute left-1 right-1 top-2 z-20 h-10 flex-row items-center justify-between">
         <Pressable className="rounded-full bg-black/55 p-2" onPress={onClosePress}>
            <X color="white" size={20} />
         </Pressable>
         <Pressable className="rounded-full bg-black/55 p-2" onPress={onOptionPress}>
            <EllipsisVertical color="white" size={20} />
         </Pressable>
      </View>
   );
};
