import "./../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
   return (
      <View className="flex-1 bg-primary">
         <StatusBar style="light" />
         <Stack
            screenOptions={{
               contentStyle: {
                  backgroundColor: "#030014",
               },
               animation: "fade_from_bottom",
            }}
         >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="anime/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="manga/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
         </Stack>
      </View>
   );
}
