import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { gql, useQuery } from "urql";

import { useAuthStore } from "@/stores/authStore";

const query = gql`
   query GetAnime {
      Page(page: 1, perPage: 10) {
         media(type: ANIME, sort: TRENDING_DESC) {
            id
            title {
               romaji
               english
            }
         }
      }
   }
`;

const Index = () => {
   const [result] = useQuery({
      query: query,
   });

   const { data, fetching, error } = result;

   const [inputValue, setInputValue] = useState("");

   const setUser = useAuthStore((state) => state.setUser);

   const currentUser = useAuthStore((state) => state.user);

   const handleSetUser = () => {
      if (!inputValue.trim()) {
         Alert.alert("Error", "Please enter a valid name");
         return;
      }

      setUser({
         id: Date.now(),
         name: inputValue,
         avatar: "https://i.pravatar.cc/150?img=3",
      });

      setInputValue("");
      Alert.alert("Success", "User has been set in the store!");
   };

   return (
      <View className="flex-1">
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

         {fetching && <Text className="text-white">Loading...</Text>}
         {error && (
            <Text className="text-red-500">
               Error: {error.graphQLErrors[0]?.message || error.message}
            </Text>
         )}
         {data && <Text className="text-white">{JSON.stringify(data)}</Text>}

         <Text className="mb-2 font-semibold text-white">Current User:</Text>
         <Text className="mb-6 italic text-emerald-400" numberOfLines={1}>
            {currentUser?.name || "No user set"}
         </Text>

         <TextInput
            className="mb-4 rounded-lg border border-white/20 bg-white/10 p-4 text-white"
            placeholder="Enter new user name..."
            placeholderTextColor="#9ca3af"
            value={inputValue}
            onChangeText={setInputValue}
         />

         <TouchableOpacity
            onPress={handleSetUser}
            className="rounded-lg bg-emerald-500 p-4 active:bg-emerald-600"
         >
            <Text className="text-center text-lg font-bold text-[#030014]">Update Auth Store</Text>
         </TouchableOpacity>
      </View>
   );
};

export default Index;
