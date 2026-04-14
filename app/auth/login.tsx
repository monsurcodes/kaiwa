import * as AuthSession from "expo-auth-session";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { ANILIST_CLIENT_ID, ANILIST_CLIENT_SECRET, ANILIST_REDIRECT_URI } from "@/constants";
import { useAuthStore } from "@/stores/authStore";

const Login = () => {
   const setToken = useAuthStore((state) => state.setToken);

   // AniList Authorization Endpoint
   const discovery = {
      authorizationEndpoint: "https://anilist.co/api/v2/oauth/authorize",
   };

   const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
         clientId: ANILIST_CLIENT_ID!,
         redirectUri: ANILIST_REDIRECT_URI!,
         responseType: AuthSession.ResponseType.Code,
      },
      discovery,
   );

   useEffect(() => {
      const exchangeCodeForToken = async (code: string) => {
         try {
            const res = await fetch("https://anilist.co/api/v2/oauth/token", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
               },
               body: JSON.stringify({
                  grant_type: "authorization_code",
                  client_id: ANILIST_CLIENT_ID,
                  client_secret: ANILIST_CLIENT_SECRET,
                  redirect_uri: ANILIST_REDIRECT_URI,
                  code: code,
               }),
            });

            const data = await res.json();
            if (data.access_token) {
               const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
               setToken(data.access_token, expiresAt);
            }
         } catch (err) {
            console.error("Token exchange failed", err);
         }
      };

      if (response?.type === "success") {
         const { code } = response.params;
         exchangeCodeForToken(code);
      }
   }, [response, setToken]);

   return (
      <View className="flex-1 items-center justify-center bg-[#030014]">
         <TouchableOpacity
            disabled={!request}
            onPress={() => promptAsync()}
            className="rounded-full bg-emerald-500 px-10 py-4 shadow-lg shadow-emerald-500/20"
         >
            <Text className="text-lg font-bold text-[#030014]">Login with AniList</Text>
         </TouchableOpacity>
      </View>
   );
};

export default Login;
