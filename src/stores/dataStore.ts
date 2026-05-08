import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
   PopularAnimeMedia,
   TrendingAnimeMedia,
   TrendingMangaMedia,
} from "@/features/home-screen/types";
import { mmkvZustandStorage } from "@/shared/lib/storage/mmkv";

interface DataState {
   trendingAnime: TrendingAnimeMedia | null;
   popularAnime: PopularAnimeMedia | null;
   trendingManga: TrendingMangaMedia | null;

   setTrendingAnime: (data: TrendingAnimeMedia) => void;
   setPopularAnime: (data: PopularAnimeMedia) => void;
   setTrendingManga: (data: TrendingMangaMedia) => void;
   clearCache: () => void;
}

const initialDataState = {
   trendingAnime: null,
   popularAnime: null,
   trendingManga: null,
};

export const useDataStore = create<DataState>()(
   persist(
      (set) => ({
         ...initialDataState,

         setTrendingAnime: (data) => set({ trendingAnime: data }),
         setPopularAnime: (data) => set({ popularAnime: data }),
         setTrendingManga: (data) => set({ trendingManga: data }),

         clearCache: () => {
            set(initialDataState);
         },
      }),
      {
         name: "data-cache",
         storage: createJSONStorage(() => mmkvZustandStorage),
      },
   ),
);
