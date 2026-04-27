import { Image } from "expo-image";

import { client } from "@/lib/graphql/client";
import { MediaType } from "@/lib/graphql/generated/graphql";
import { GetAuthUserDataQuery } from "@/lib/graphql/queries/getAuthUserData";
import { GetPopularAnimeQuery } from "@/lib/graphql/queries/getPopularAnime";
import { GetTrendingAnimeQuery } from "@/lib/graphql/queries/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/lib/graphql/queries/getTrendingManga";
import { GetUserLibraryQuery } from "@/lib/graphql/queries/getUserLibrary";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import {
   PopularAnimeMedia,
   TrendingAnimeMedia,
   TrendingMangaMedia,
   UserLibraryLists,
   UserProfile,
} from "@/types";

const isString = (value: string | null | undefined): value is string =>
   typeof value === "string" && value.length > 0;

export const refreshHomeScreenMedia = async () => {
   const { setTrendingAnime, setPopularAnime, setTrendingManga } = useDataStore.getState();

   const preloadMediaImages = (
      mediaList: TrendingAnimeMedia | PopularAnimeMedia | TrendingMangaMedia,
   ) => {
      const urls = mediaList.map((item) => item?.coverImage?.large).filter(isString);
      urls.push(...mediaList.map((item) => item?.bannerImage).filter(isString));
      Image.prefetch(urls);
   };

   const [trendingAnimeResult, popularAnimeResult, trendingMangaResult] = await Promise.all([
      client.query(GetTrendingAnimeQuery, {}, { requestPolicy: "network-only" }).toPromise(),
      client.query(GetPopularAnimeQuery, {}, { requestPolicy: "network-only" }).toPromise(),
      client.query(GetTrendingMangaQuery, {}, { requestPolicy: "network-only" }).toPromise(),
   ]);

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
};

export const refreshUserLibrary = async () => {
   const { isLoggedIn, userProfile } = useAuthStore.getState();
   if (!isLoggedIn || !userProfile) return;

   const { setUserAnimeLibraryLists, setUserMangaLibraryLists } = useAuthStore.getState();

   const preloadUserLibraryImages = (lists: UserLibraryLists) => {
      const urls = lists
         .flatMap((list) => list?.entries)
         .map((entry) => entry?.media?.coverImage?.large)
         .filter(isString);
      Image.prefetch(urls);
   };

   const [userAnimeLibraryResult, userMangaLibraryResult] = await Promise.all([
      client
         .query(
            GetUserLibraryQuery,
            { userId: userProfile.id, type: MediaType.Anime },
            { requestPolicy: "network-only" },
         )
         .toPromise(),
      client
         .query(
            GetUserLibraryQuery,
            { userId: userProfile.id, type: MediaType.Manga },
            { requestPolicy: "network-only" },
         )
         .toPromise(),
   ]);

   if (
      userAnimeLibraryResult?.data?.MediaListCollection?.lists &&
      userAnimeLibraryResult?.data?.MediaListCollection?.lists.length > 0
   ) {
      setUserAnimeLibraryLists(userAnimeLibraryResult?.data?.MediaListCollection?.lists);
      preloadUserLibraryImages(userAnimeLibraryResult?.data?.MediaListCollection?.lists);
   }

   if (
      userMangaLibraryResult?.data?.MediaListCollection?.lists &&
      userMangaLibraryResult?.data?.MediaListCollection?.lists.length > 0
   ) {
      setUserMangaLibraryLists(userMangaLibraryResult?.data?.MediaListCollection?.lists);
      preloadUserLibraryImages(userMangaLibraryResult?.data?.MediaListCollection?.lists);
   }
};

export const refreshUserProfile = async () => {
   const { isLoggedIn, setUserProfile } = useAuthStore.getState();

   if (!isLoggedIn) return;

   const preloadUserProfileImages = (userProfile: UserProfile) => {
      const urls = [userProfile.bannerImage, userProfile.avatar?.large].filter(isString);
      Image.prefetch(urls);
   };

   const userProfileResult = await client
      .query(GetAuthUserDataQuery, {}, { requestPolicy: "network-only" })
      .toPromise();

   if (userProfileResult.data?.Viewer) {
      setUserProfile(userProfileResult.data.Viewer);
      preloadUserProfileImages(userProfileResult.data.Viewer);
   }
};

export const refreshAllData = async () => {
   await Promise.all([refreshHomeScreenMedia(), refreshUserProfile(), refreshUserLibrary()]);
};
