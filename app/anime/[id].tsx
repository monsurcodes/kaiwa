import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Anime = () => {
   const { id } = useLocalSearchParams();
   return (
      <SafeAreaView className="flex-1 items-center justify-center">
         <Text className="text-white">Anime: {id}</Text>
      </SafeAreaView>
   );
};

export default Anime;
