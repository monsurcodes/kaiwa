import "./../global.css";

import { Image } from "expo-image";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "urql";

import { theme } from "@/constants/theme";
import { client } from "@/lib/graphql/client";
import type {
   GetAuthUserDataQuery as GetAuthUserDataQueryData,
   GetPopularAnimeQuery as GetPopularAnimeQueryData,
   GetTrendingAnimeQuery as GetTrendingAnimeQueryData,
   GetTrendingMangaQuery as GetTrendingMangaQueryData,
} from "@/lib/graphql/generated/graphql";
import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { GetPopularAnimeQuery } from "@/lib/graphql/queries/getPopularAnime";
import { GetTrendingAnimeQuery } from "@/lib/graphql/queries/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/lib/graphql/queries/getTrendingManga";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/useDataStore";

void SplashScreen.preventAutoHideAsync();

type TrendingAnimeMedia = NonNullable<NonNullable<GetTrendingAnimeQueryData["Page"]>["media"]>;
type PopularAnimeMedia = NonNullable<NonNullable<GetPopularAnimeQueryData["Page"]>["media"]>;
type TrendingMangaMedia = NonNullable<NonNullable<GetTrendingMangaQueryData["Page"]>["media"]>;
type UserProfile = NonNullable<GetAuthUserDataQueryData["Viewer"]>;

export default function RootLayout() {
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
   const segments = useSegments();
   const router = useRouter();

   const [isReady, setIsReady] = useState(false);

   const refreshCachedData = async () => {
      const isString = (value: string | null | undefined): value is string =>
         typeof value === "string" && value.length > 0;

      const preloadMediaImages = (
         mediaList: TrendingAnimeMedia | PopularAnimeMedia | TrendingMangaMedia,
      ) => {
         const urls = mediaList.map((item) => item?.coverImage?.large).filter(isString);
         urls.push(...mediaList.map((item) => item?.bannerImage).filter(isString));
         Image.prefetch(urls);
      };

      const preloadUserProfileImages = (userProfile: UserProfile) => {
         const urls = [userProfile.bannerImage, userProfile.avatar?.large].filter(isString);
         Image.prefetch(urls);
      };

      if (!useAuthStore.getState().isLoggedIn) {
         return;
      }

      const { setTrendingAnime, setPopularAnime, setTrendingManga } = useDataStore.getState();

      const { setUserProfile } = useAuthStore.getState();

      const [trendingAnimeResult, popularAnimeResult, trendingMangaResult, userProfileResult] =
         await Promise.all([
            client.query(GetTrendingAnimeQuery, {}, { requestPolicy: "network-only" }).toPromise(),
            client.query(GetPopularAnimeQuery, {}, { requestPolicy: "network-only" }).toPromise(),
            client.query(GetTrendingMangaQuery, {}, { requestPolicy: "network-only" }).toPromise(),
            client.query(GetAuthUserDataQuery, {}, { requestPolicy: "network-only" }).toPromise(),
         ]);

      if (!useAuthStore.getState().isLoggedIn) {
         return;
      }

      if (trendingAnimeResult.data?.Page?.media) {
         setTrendingAnime(trendingAnimeResult.data.Page.media);
         preloadMediaImages(trendingAnimeResult.data.Page.media);
      }

      if (popularAnimeResult.data?.Page?.media) {
         setPopularAnime(popularAnimeResult.data.Page.media);
         preloadMediaImages(popularAnimeResult.data.Page.media);
      }

      if (trendingMangaResult.data?.Page?.media) {
         setTrendingManga(trendingMangaResult.data.Page.media);
         preloadMediaImages(trendingMangaResult.data.Page.media);
      }

      if (userProfileResult.data?.Viewer) {
         setUserProfile(userProfileResult.data.Viewer);
         preloadUserProfileImages(userProfileResult.data.Viewer);
      }
   };

   useEffect(() => {
      let isMounted = true;

      const preload = async () => {
         try {
            if (!isLoggedIn) {
               if (isMounted) setIsReady(true);
               return;
            }

            const { trendingAnime, popularAnime, trendingManga } = useDataStore.getState();

            const { userProfile } = useAuthStore.getState();

            const hasCachedData = Boolean(
               trendingAnime || popularAnime || trendingManga || userProfile,
            );

            if (hasCachedData) {
               if (isMounted) setIsReady(true);

               void refreshCachedData().catch((error) => {
                  console.error("[SWR] Revalidation failed:", error);
               });

               return;
            }

            await refreshCachedData();
         } catch (error) {
            console.error("[SWR] Startup preload failed:", error);
         } finally {
            if (isMounted) setIsReady(true);
         }
      };

      void preload();

      return () => {
         isMounted = false;
      };
   }, [isLoggedIn]);

   useEffect(() => {
      if (!isReady) return;

      SplashScreen.hideAsync();
   }, [isReady]);

   useEffect(() => {
      if (!isReady) return;

      const inAuthGroup = segments[0] === "auth";

      if (!isLoggedIn && !inAuthGroup) {
         router.replace("/auth/login");
      } else if (isLoggedIn && inAuthGroup) {
         router.replace("/(tabs)");
      }
   }, [isLoggedIn, segments, isReady, router]);

   useEffect(() => {
      async function onFetchUpdateAsync() {
         try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
               await Updates.fetchUpdateAsync();

               Alert.alert("Update Available", "A new version of Kaiwa is ready. Restart now?", [
                  { text: "Later" },
                  { text: "Restart", onPress: () => Updates.reloadAsync() },
               ]);
            }
         } catch (error) {
            console.warn(`Error fetching update: ${error}`);
         }
      }

      if (!__DEV__) {
         onFetchUpdateAsync();
      }
   }, []);

   return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg.base }}>
         <SafeAreaProvider>
            <Provider value={client}>
               <StatusBar style="light" />
               <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.bg.base }}>
                  <Stack
                     screenOptions={{
                        contentStyle: {
                           backgroundColor: theme.bg.base,
                        },
                        animation: "slide_from_left",
                     }}
                  >
                     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                     <Stack.Screen
                        name="anime/[id]"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                     <Stack.Screen
                        name="manga/[id]"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                     <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                     <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
                     <Stack.Screen
                        name="settings"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                  </Stack>
               </SafeAreaView>
            </Provider>
         </SafeAreaProvider>
      </GestureHandlerRootView>
   );
}
