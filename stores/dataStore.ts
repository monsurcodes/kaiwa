import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
   GetPopularAnimeQuery,
   GetTrendingAnimeQuery,
   GetTrendingMangaQuery,
} from "@/lib/graphql/generated/graphql";
import { storage } from "@/lib/storage/mmkv";

type TrendingAnimeList = NonNullable<NonNullable<GetTrendingAnimeQuery["Page"]>["media"]>;
type PopularAnimeList = NonNullable<NonNullable<GetPopularAnimeQuery["Page"]>["media"]>;
type TrendingMangaList = NonNullable<NonNullable<GetTrendingMangaQuery["Page"]>["media"]>;

interface DataState {
   trendingAnime: TrendingAnimeList | null;
   popularAnime: PopularAnimeList | null;
   trendingManga: TrendingMangaList | null;

   setTrendingAnime: (data: TrendingAnimeList) => void;
   setPopularAnime: (data: PopularAnimeList) => void;
   setTrendingManga: (data: TrendingMangaList) => void;
   clearCache: () => void;
}

const mmkvStorage = {
   getItem: (name: string) => storage.getString(name) ?? null,
   setItem: (name: string, value: string) => storage.set(name, value),
   removeItem: (name: string) => storage.remove(name),
};

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
            storage.remove("data-cache");
         },
      }),
      {
         name: "data-cache",
         storage: createJSONStorage(() => mmkvStorage),
      },
   ),
);
