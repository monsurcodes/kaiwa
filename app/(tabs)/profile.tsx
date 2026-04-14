import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { useAuthStore } from "@/stores/authStore";

const Profile = () => {
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
      <View>
         <Text className="text-3xl text-emerald-500">Profile Screen</Text>
         <View>
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
               <Text className="text-center text-lg font-bold text-[#030014]">
                  Update Auth Store
               </Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default Profile;
