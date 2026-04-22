import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useQuery } from "urql";

import FavCard from "@/components/FavCard";
import FloatingButton from "@/components/FloatingButton";
import MarkdownText from "@/components/MarkdownText";
import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { minutesToDays } from "@/lib/utils/date";
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

   const bannerUri = (profileData?.bannerImage ?? "").trim();
   const avatarUri = (profileData?.avatar?.large ?? "").trim();

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
            {/* banner */}
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

            {/* about */}
            {profileData?.about && (
               <View className="mb-4">
                  <Text className="text-lg font-semibold text-white">About</Text>
                  <MarkdownText content={profileData?.about ?? ""} />
               </View>
            )}

            {/* stats */}
            <View className="mb-4">
               <Text className="mb-2 text-lg font-semibold text-white">Stats</Text>
               <View className="gap-2 rounded-md bg-slate-900/70 px-4 py-2">
                  {/* total anime */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Total Anime</Text>
                     <Text className="w-1/2 text-white">
                        {profileData?.statistics?.anime?.count ?? 0}
                     </Text>
                  </View>

                  {/* ep watched */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Episodes Watched</Text>
                     <Text className="w-1/2 text-white">
                        {profileData?.statistics?.anime?.episodesWatched ?? 0}
                     </Text>
                  </View>

                  {/* days watched */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Days Watched</Text>
                     <Text className="w-1/2 text-white">
                        {minutesToDays(profileData?.statistics?.anime?.minutesWatched ?? 0)}
                     </Text>
                  </View>

                  {/* anime mean score */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Anime Mean Score</Text>
                     <Text className="w-1/2 text-white">
                        {profileData?.statistics?.anime?.meanScore ?? 0}
                     </Text>
                  </View>

                  {/* total manga */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Total Manga</Text>
                     <Text className="w-1/2 text-white">
                        {profileData?.statistics?.manga?.count ?? 0}
                     </Text>
                  </View>

                  {/* chapters read */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Chapters Read</Text>
                     <Text className="w-1/2 text-white">
                        {profileData?.statistics?.manga?.chaptersRead ?? 0}
                     </Text>
                  </View>

                  {/* manga mean score */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Manga Mean Score</Text>
                     <Text className="w-1/2 text-white">
                        {profileData?.statistics?.manga?.meanScore ?? 0}
                     </Text>
                  </View>
               </View>
            </View>

            {/* fav anime */}
            {(profileData?.favourites?.anime?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Anime</Text>
                  <FlashList
                     data={profileData?.favourites?.anime?.nodes}
                     renderItem={({ item }) => (
                        <FavCard
                           id={item?.id ?? 0}
                           title={
                              item?.title?.english ?? item?.title?.romaji ?? "Title Unavailable"
                           }
                           image={item?.coverImage?.large ?? ""}
                           type="anime"
                        />
                     )}
                     keyExtractor={(item, index) => item?.id?.toString() ?? `anime-${index}`}
                     horizontal
                  />
               </View>
            )}

            {/* fav manga */}
            {(profileData?.favourites?.manga?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite manga</Text>
                  <FlashList
                     data={profileData?.favourites?.manga?.nodes}
                     renderItem={({ item }) => (
                        <FavCard
                           id={item?.id ?? 0}
                           title={
                              item?.title?.english ?? item?.title?.romaji ?? "Title Unavailable"
                           }
                           image={item?.coverImage?.extraLarge ?? ""}
                           type="manga"
                        />
                     )}
                     keyExtractor={(item, index) => item?.id?.toString() ?? `manga-${index}`}
                     horizontal
                  />
               </View>
            )}

            {/* fav characters */}
            {(profileData?.favourites?.characters?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Characters</Text>
                  <FlashList
                     data={profileData?.favourites?.characters?.nodes}
                     renderItem={({ item }) => (
                        <FavCard
                           id={item?.id ?? 0}
                           title={item?.name?.full ?? "Name Unavailable"}
                           image={item?.image?.large ?? ""}
                           type="character"
                        />
                     )}
                     keyExtractor={(item, index) => item?.id?.toString() ?? `character-${index}`}
                     horizontal
                  />
               </View>
            )}

            {/* fav staff */}
            {(profileData?.favourites?.staff?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Staff</Text>
                  <FlashList
                     data={profileData?.favourites?.staff?.nodes}
                     renderItem={({ item }) => (
                        <FavCard
                           id={item?.id ?? 0}
                           title={item?.name?.full ?? "Name Unavailable"}
                           image={item?.image?.large ?? ""}
                           type="staff"
                        />
                     )}
                     keyExtractor={(item, index) => item?.id?.toString() ?? `staff-${index}`}
                     horizontal
                  />
               </View>
            )}

            {/* fav studios */}
            {(profileData?.favourites?.studios?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Studios</Text>
                  <FlashList
                     data={profileData?.favourites?.studios?.nodes}
                     renderItem={({ item }) => (
                        <Text className="mr-3 rounded-md bg-slate-900/70 px-3 py-2 font-bold text-white">
                           {item?.name ?? "Name Unavailable"}
                        </Text>
                     )}
                     keyExtractor={(item, index) => item?.id?.toString() ?? `studio-${index}`}
                     horizontal
                  />
               </View>
            )}
         </ScrollView>
         <FloatingButton Icon={Settings} onPress={() => router.push("/settings")} />
      </View>
   );
};

export default Profile;
