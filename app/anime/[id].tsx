import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Anime = () => {
   const { id } = useLocalSearchParams();
   return (
      <View>
         <Text className="text-white">Anime: {id}</Text>
      </View>
   );
};

export default Anime;
