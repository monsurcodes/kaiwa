import { authExchange } from "@urql/exchange-auth";
import { cacheExchange, Client, fetchExchange } from "urql";

import { ANILIST_API_URL } from "@/constants";
import { useAuthStore } from "@/stores/authStore";

export const client = new Client({
   url: ANILIST_API_URL,
   preferGetMethod: false,
   exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
         return {
            addAuthToOperation(operation) {
               // Access the token directly from the Zustand store state
               const token = useAuthStore.getState().token;

               if (!token) return operation;

               return utils.appendHeaders(operation, {
                  Authorization: `Bearer ${token}`,
               });
            },
            didAuthError(error, _operation) {
               // Check for 401 Unauthorized or specific AniList auth errors
               return error.response?.status === 401;
            },
            async refreshAuth() {
               // If the token is invalid or expired, trigger a logout
               // In AniList, tokens are long-lived, so usually you just log out
               useAuthStore.getState().logout();
            },
            willAuthError(_operation) {
               const { token, expiresAt } = useAuthStore.getState();

               if (!token) return false;

               // If expiresAt exists, check if the current time has passed it
               if (expiresAt && Date.now() > expiresAt * 1000) {
                  return true;
               }

               return false;
            },
         };
      }),
      fetchExchange,
   ],
   fetchOptions: {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Accept: "application/json",
      },
   },
});
