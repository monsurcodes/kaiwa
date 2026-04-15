import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useQuery } from "urql";

import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { type AuthUserDataInterface } from "@/types/authUserDataInterface";

const Profile = () => {
   const [authUser] = useQuery<AuthUserDataInterface["data"]>({
      query: GetAuthUserDataQuery,
   });

   const { data, fetching, error } = authUser;

   if (error) console.error("Error fetching authenticated user data:", error);

   // console.log("Authenticated User Data:", data);

   return (
      <View className="w-full flex-1">
         <ScrollView className="flex-1" contentContainerStyle={{ alignItems: "center" }}>
            {fetching && <Text className="text-white">Loading...</Text>}
            <View className="relative flex w-full items-center">
               <Image
                  source={{ uri: data?.Viewer.bannerImage }}
                  className="h-52 w-full rounded-lg"
               />
               <Image
                  source={{ uri: data?.Viewer.avatar.large }}
                  className="absolute -bottom-20 h-40 w-40 rounded-full border-4 border-[#030014]"
               />
            </View>
            <Text className="mt-20 text-xl font-semibold text-white">
               Hello, {data?.Viewer.name}!
            </Text>

            <Text className="text-white">{data?.Viewer.about}</Text>
         </ScrollView>
      </View>
   );
};

export default Profile;
