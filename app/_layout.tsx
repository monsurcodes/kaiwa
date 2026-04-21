import "./../global.css";

import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "urql";

import { client } from "@/lib/graphql/client";
import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { GetPopularAnimeQuery } from "@/lib/graphql/queries/getPopularAnime";
import { GetTrendingAnimeQuery } from "@/lib/graphql/queries/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/lib/graphql/queries/getTrendingManga";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/useDataStore";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
   const segments = useSegments();
   const router = useRouter();

   const [isReady, setIsReady] = useState(false);

   const refreshCachedData = async () => {
      console.log("[SWR] Revalidation started: fetching latest app data.");

      const { setTrendingAnime, setPopularAnime, setTrendingManga, setUserProfile } =
         useDataStore.getState();

      const [trendingAnimeResult, popularAnimeResult, trendingMangaResult, userProfileResult] =
         await Promise.all([
            client.query(GetTrendingAnimeQuery, {}).toPromise(),
            client.query(GetPopularAnimeQuery, {}).toPromise(),
            client.query(GetTrendingMangaQuery, {}).toPromise(),
            client.query(GetAuthUserDataQuery, {}).toPromise(),
         ]);

      if (trendingAnimeResult.data?.Page?.media) {
         setTrendingAnime(trendingAnimeResult.data.Page.media);
      }

      if (popularAnimeResult.data?.Page?.media) {
         setPopularAnime(popularAnimeResult.data.Page.media);
      }

      if (trendingMangaResult.data?.Page?.media) {
         setTrendingManga(trendingMangaResult.data.Page.media);
      }

      if (userProfileResult.data?.Viewer) {
         setUserProfile(userProfileResult.data.Viewer);
      }

      console.log("[SWR] Revalidation completed: cache updated with fresh data.");
   };

   useEffect(() => {
      let isMounted = true;

      const preload = async () => {
         try {
            if (!isLoggedIn) {
               console.log("[SWR] User is not logged in: skipping preload and revalidation.");
               if (isMounted) setIsReady(true);
               return;
            }

            const { trendingAnime, popularAnime, trendingManga, userProfile } =
               useDataStore.getState();

            const hasCachedData = Boolean(
               trendingAnime || popularAnime || trendingManga || userProfile,
            );

            if (hasCachedData) {
               console.log("[SWR] Cache hit on app start: rendering cached data immediately.");
               if (isMounted) setIsReady(true);

               void refreshCachedData().catch((error) => {
                  console.error("[SWR] Revalidation failed:", error);
               });

               return;
            }

            console.log("[SWR] Cache miss on app start: fetching data before rendering.");
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

      console.log("[SWR] App is ready: hiding splash screen.");
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

   return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#030014" }}>
         <SafeAreaProvider>
            <Provider value={client}>
               <StatusBar style="light" />
               <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#030014" }}>
                  <Stack
                     screenOptions={{
                        contentStyle: {
                           backgroundColor: "#030014",
                        },
                        animation: "slide_from_left",
                     }}
                  >
                     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                     <Stack.Screen
                        name="anime/[id]"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                     <Stack.Screen name="manga/[id]" options={{ headerShown: false }} />
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
