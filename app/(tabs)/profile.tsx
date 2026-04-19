import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useQuery } from "urql";

import MarkdownText from "@/components/MarkdownText";
import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { type AuthUserDataInterface } from "@/types/authUserDataInterface";

const Profile = () => {
   const [authUser] = useQuery<AuthUserDataInterface["data"]>({
      query: GetAuthUserDataQuery,
   });

   const { data, fetching, error } = authUser;
   const bannerUri = (data?.Viewer.bannerImage || "").trim();
   const avatarUri = (data?.Viewer.avatar.large || "").trim();

   if (error) console.error("Error fetching authenticated user data:", error);

   if (fetching)
      return (
         <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} />
         </View>
      );

   return (
      <View className="w-full flex-1">
         <ScrollView className="flex-1" contentContainerStyle={{ alignItems: "center" }}>
            {fetching && <Text className="text-white">Loading...</Text>}
            <View className="relative flex w-full items-center">
               {bannerUri ? (
                  <Image
                     source={{ uri: bannerUri }}
                     style={{ width: "100%", height: 208, borderRadius: 8 }}
                     contentFit="cover"
                     cachePolicy="memory-disk"
                  />
               ) : (
                  <View
                     style={{ width: "100%", height: 208, borderRadius: 8 }}
                     className="bg-slate-800"
                  />
               )}

               {avatarUri ? (
                  <Image
                     source={{ uri: avatarUri }}
                     style={{
                        position: "absolute",
                        bottom: -80,
                        width: 160,
                        height: 160,
                        borderRadius: 80,
                        borderWidth: 4,
                        borderColor: "#030014",
                     }}
                     contentFit="cover"
                     cachePolicy="memory-disk"
                  />
               ) : (
                  <View
                     style={{
                        position: "absolute",
                        bottom: -80,
                        width: 160,
                        height: 160,
                        borderRadius: 80,
                        borderWidth: 4,
                        borderColor: "#030014",
                     }}
                     className="bg-slate-800"
                  />
               )}
            </View>
            <Text className="mt-20 text-xl font-semibold text-white">
               Hello, {data?.Viewer.name}!
            </Text>

            {/* <Text className="text-white">{data?.Viewer.about}</Text> */}
            {/* <HtmlText htmlContent={textAbout} /> */}
            <MarkdownText content={data?.Viewer.about || ""} />

            <Text className="text-white"> Yo wassup</Text>
         </ScrollView>
      </View>
   );
};

export default Profile;
