import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Library = () => {
   return (
      <SafeAreaView className="flex-1 items-center justify-center">
         <Text className="text-3xl text-emerald-500">Library Screen</Text>
      </SafeAreaView>
   );
};

export default Library;
