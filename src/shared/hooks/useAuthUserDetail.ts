import { useEffect } from "react";
import { useQuery } from "urql";

import { GetAuthUserDataQuery } from "@/shared/lib/graphql/queries/getAuthUserData";
import { useAuthStore } from "@/stores/authStore";

export const useAuthUserDetail = () => {
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

   return { profileData, fetching, error };
};
