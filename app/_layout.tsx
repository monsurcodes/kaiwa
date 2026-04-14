import "./../global.css";

import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "urql";

import { client } from "@/lib/graphql/client";
import { useAuthStore } from "@/stores/authStore";

export default function RootLayout() {
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
   const segments = useSegments();
   const router = useRouter();

   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      setIsReady(true);
   }, []);

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
                           padding: 1,
                        },
                        animation: "fade_from_bottom",
                     }}
                  >
                     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                     <Stack.Screen name="anime/[id]" options={{ headerShown: false }} />
                     <Stack.Screen name="manga/[id]" options={{ headerShown: false }} />
                     <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                     <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
                  </Stack>
               </SafeAreaView>
            </Provider>
         </SafeAreaProvider>
      </GestureHandlerRootView>
   );
}
