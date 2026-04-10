import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
   return (
      <SafeAreaView className="flex-1">
         <Text className="text-3xl text-emerald-500">Home screen</Text>

         <Link href="/anime/apple" asChild>
            <TouchableOpacity className="mt-4 rounded bg-emerald-500 px-4 py-2">
               <Text className="text-white">Go to Anime</Text>
            </TouchableOpacity>
         </Link>

         <Link href="/manga/haimiya senpai" asChild>
            <TouchableOpacity className="mt-4 rounded bg-emerald-500 px-4 py-2">
               <Text className="text-white">Go to Manga</Text>
            </TouchableOpacity>
         </Link>

         <Link href="/auth/login" asChild>
            <TouchableOpacity className="mt-4 rounded bg-emerald-500 px-4 py-2">
               <Text className="text-white">Go to Login</Text>
            </TouchableOpacity>
         </Link>
      </SafeAreaView>
   );
};

export default Index;
