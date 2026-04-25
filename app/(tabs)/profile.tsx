import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useQuery } from "urql";

import AboutCard from "@/components/profile/AboutCard";
import FavAnimeList from "@/components/profile/FavAnimeList";
import FavCharacterList from "@/components/profile/FavCharacterList";
import FavMangaList from "@/components/profile/FavMangaList";
import FavStaffList from "@/components/profile/FavStaffList";
import FavStudioList from "@/components/profile/FavStudioList";
import ProfileHeroBanner from "@/components/profile/ProfileHeroBanner";
import StatsInfo from "@/components/profile/StatsInfo";
import FloatingButton from "@/components/ui/FloatingButton";
import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { useAuthStore } from "@/stores/authStore";

const Profile = () => {
   const router = useRouter();
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
   const { userProfile, setUserProfile } = useAuthStore();

   const [authUser] = useQuery({
      query: GetAuthUserDataQuery,
      pause: !isLoggedIn || Boolean(userProfile),
      requestPolicy: "network-only",
   });

   const { data, fetching, error } = authUser;
   const profileData = userProfile ?? data?.Viewer;

   useEffect(() => {
      if (isLoggedIn && !userProfile && data?.Viewer) {
         setUserProfile(data.Viewer);
      }
   }, [data?.Viewer, isLoggedIn, setUserProfile, userProfile]);

   if (error) console.error("Error fetching authenticated user data:", error);

   if (!profileData && fetching)
      return (
         <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} />
         </View>
      );

   return (
      <View className="w-full flex-1">
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         >
            <ProfileHeroBanner profileData={profileData} />
            <AboutCard aboutText={profileData?.about} />
            <View className="mb-24 mt-6 flex-1 gap-6">
               <StatsInfo profileData={profileData} />
               <FavAnimeList profileData={profileData} />
               <FavMangaList profileData={profileData} />
               <FavCharacterList profileData={profileData} />
               <FavStaffList profileData={profileData} />
               <FavStudioList profileData={profileData} />
            </View>
         </ScrollView>

         <FloatingButton Icon={Settings} onPress={() => router.push("/settings")} />
      </View>
   );
};

export default Profile;
