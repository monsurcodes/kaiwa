import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const Manga = () => {
   const { id } = useLocalSearchParams();
   return (
      <View>
         <Text className="text-white">manga: {id}</Text>
      </View>
   );
};

export default Manga;
