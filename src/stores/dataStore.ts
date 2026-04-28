import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
   GetPopularAnimeQuery,
   GetTrendingAnimeQuery,
   GetTrendingMangaQuery,
} from "@/shared/lib/graphql/generated/graphql";
import { mmkvZustandStorage } from "@/shared/lib/storage/mmkv";

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
