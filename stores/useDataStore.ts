import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
   GetAuthUserDataQuery,
   GetPopularAnimeQuery,
   GetTrendingAnimeQuery,
   GetTrendingMangaQuery,
} from "@/lib/graphql/generated/graphql";
import { storage } from "@/lib/storage/mmkv";

type TrendingAnimeList = NonNullable<NonNullable<GetTrendingAnimeQuery["Page"]>["media"]>;
type PopularAnimeList = NonNullable<NonNullable<GetPopularAnimeQuery["Page"]>["media"]>;
type TrendingMangaList = NonNullable<NonNullable<GetTrendingMangaQuery["Page"]>["media"]>;
type UserProfile = NonNullable<GetAuthUserDataQuery["Viewer"]>;

interface DataState {
   trendingAnime: TrendingAnimeList | null;
   popularAnime: PopularAnimeList | null;
   trendingManga: TrendingMangaList | null;
   userProfile: UserProfile | null;
   setTrendingAnime: (data: TrendingAnimeList) => void;
   setPopularAnime: (data: PopularAnimeList) => void;
   setTrendingManga: (data: TrendingMangaList) => void;
   setUserProfile: (data: UserProfile) => void;
   clearCache: () => void;
}

const mmkvStorage = {
   getItem: (name: string) => storage.getString(name) ?? null,
   setItem: (name: string, value: string) => storage.set(name, value),
   removeItem: (name: string) => storage.remove(name),
};

export const useDataStore = create<DataState>()(
   persist(
      (set) => ({
         trendingAnime: null,
         popularAnime: null,
         trendingManga: null,
         userProfile: null,

         setTrendingAnime: (data) => set({ trendingAnime: data }),
         setPopularAnime: (data) => set({ popularAnime: data }),
         setTrendingManga: (data) => set({ trendingManga: data }),
         setUserProfile: (data) => set({ userProfile: data }),

         clearCache: () =>
            set({
               trendingAnime: null,
               popularAnime: null,
               trendingManga: null,
               userProfile: null,
            }),
      }),
      {
         name: "data-cache",
         storage: createJSONStorage(() => mmkvStorage),
      },
   ),
);
