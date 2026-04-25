import { Image } from "expo-image";
import { Text, View } from "react-native";

import { UserProfile } from "@/types";

interface ProfileHeroBannerProps {
   profileData: UserProfile | null | undefined;
}

const ProfileHeroBanner = ({ profileData }: ProfileHeroBannerProps) => {
   const bannerUri = (profileData?.bannerImage ?? "").trim();
   const avatarUri = (profileData?.avatar?.large ?? "").trim();

   return (
      <View className="relative mb-4 flex w-full justify-center">
         {bannerUri ? (
            <Image
               source={{ uri: bannerUri }}
               style={{ width: "100%", height: 208, borderRadius: 8 }}
               contentFit="cover"
               cachePolicy="disk"
               transition={100}
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
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  borderWidth: 4,
                  borderColor: "#030014",
                  marginRight: 6,
                  alignSelf: "flex-end",
               }}
               contentFit="cover"
               cachePolicy="disk"
               transition={100}
            />
         ) : (
            <View
               style={{
                  position: "absolute",
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  borderWidth: 4,
                  borderColor: "#030014",
                  marginRight: 6,
                  alignSelf: "flex-end",
               }}
               className="bg-slate-800"
            />
         )}

         <Text
            className="rounded-md bg-slate-900/70 px-2 py-1 text-xl font-semibold text-white"
            style={{
               position: "absolute",
               marginLeft: 10,
            }}
         >
            Hello!, {profileData?.name ?? "User"}
         </Text>
      </View>
   );
};

export default ProfileHeroBanner;
