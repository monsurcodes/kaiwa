import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useQuery } from "urql";

import FavCard from "@/components/FavCard";
import FloatingButton from "@/components/FloatingButton";
import MarkdownText from "@/components/MarkdownText";
import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { minutesToDays } from "@/lib/utils/date";

const Profile = () => {
   const router = useRouter();
   const [authUser] = useQuery({
      query: GetAuthUserDataQuery,
   });

   const { data, fetching, error } = authUser;
   const bannerUri = (data?.Viewer?.bannerImage ?? "").trim();
   const avatarUri = (data?.Viewer?.avatar?.large ?? "").trim();

   if (error) console.error("Error fetching authenticated user data:", error);

   if (fetching)
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
                        width: 160,
                        height: 160,
                        borderRadius: 80,
                        borderWidth: 4,
                        borderColor: "#030014",
                        marginRight: 6,
                        alignSelf: "flex-end",
                     }}
                     contentFit="cover"
                     cachePolicy="memory-disk"
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
                  Hello!, {data?.Viewer?.name ?? "User"}
               </Text>
            </View>

            {/* about */}
            <View className="mb-4">
               <Text className="text-lg font-semibold text-white">About</Text>
               <MarkdownText content={data?.Viewer?.about ?? ""} />
            </View>

            {/* stats */}
            <View className="mb-4">
               <Text className="mb-2 text-lg font-semibold text-white">Stats</Text>
               <View className="gap-2 rounded-md bg-slate-900/70 px-4 py-2">
                  {/* total anime */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Total Anime</Text>
                     <Text className="w-1/2 text-white">
                        {data?.Viewer?.statistics?.anime?.count ?? 0}
                     </Text>
                  </View>

                  {/* ep watched */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Episodes Watched</Text>
                     <Text className="w-1/2 text-white">
                        {data?.Viewer?.statistics?.anime?.episodesWatched ?? 0}
                     </Text>
                  </View>

                  {/* days watched */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Days Watched</Text>
                     <Text className="w-1/2 text-white">
                        {minutesToDays(data?.Viewer?.statistics?.anime?.minutesWatched ?? 0)}
                     </Text>
                  </View>

                  {/* anime mean score */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Anime Mean Score</Text>
                     <Text className="w-1/2 text-white">
                        {data?.Viewer?.statistics?.anime?.meanScore ?? 0}
                     </Text>
                  </View>

                  {/* total manga */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Total Manga</Text>
                     <Text className="w-1/2 text-white">
                        {data?.Viewer?.statistics?.manga?.count ?? 0}
                     </Text>
                  </View>

                  {/* chapters read */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Chapters Read</Text>
                     <Text className="w-1/2 text-white">
                        {data?.Viewer?.statistics?.manga?.chaptersRead ?? 0}
                     </Text>
                  </View>

                  {/* manga mean score */}
                  <View className="flex-row">
                     <Text className="w-1/2 text-white">Manga Mean Score</Text>
                     <Text className="w-1/2 text-white">
                        {data?.Viewer?.statistics?.manga?.meanScore ?? 0}
                     </Text>
                  </View>
               </View>
            </View>

            {/* fav anime */}
            {(data?.Viewer?.favourites?.anime?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Anime</Text>
                  <FlashList
                     data={data?.Viewer?.favourites?.anime?.nodes}
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
            {(data?.Viewer?.favourites?.manga?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite manga</Text>
                  <FlashList
                     data={data?.Viewer?.favourites?.manga?.nodes}
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
            {(data?.Viewer?.favourites?.characters?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Characters</Text>
                  <FlashList
                     data={data?.Viewer?.favourites?.characters?.nodes}
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
            {(data?.Viewer?.favourites?.staff?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Staff</Text>
                  <FlashList
                     data={data?.Viewer?.favourites?.staff?.nodes}
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
            {(data?.Viewer?.favourites?.studios?.nodes?.length ?? 0) > 0 && (
               <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Favorite Studios</Text>
                  <FlashList
                     data={data?.Viewer?.favourites?.studios?.nodes}
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
