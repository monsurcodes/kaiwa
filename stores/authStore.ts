import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { FuzzyDateInput, MediaListStatus } from "@/lib/graphql/generated/graphql";
import { mmkvZustandStorage } from "@/lib/storage/mmkv";
import { UserLibraryLists, UserProfile } from "@/types";

interface AuthState {
   token: string | null;
   expiresAt: number | null;
   userProfile: UserProfile | null;
   userAnimeLibraryLists: UserLibraryLists | null;
   userMangaLibraryLists: UserLibraryLists | null;
   isLoggedIn: boolean;

   setToken: (token: string, expiresAt: number) => void;

   setUserProfile: (data: UserProfile) => void;
   setUserAnimeLibraryLists: (lists: UserLibraryLists) => void;
   setUserMangaLibraryLists: (lists: UserLibraryLists) => void;

   logout: () => void;

   updateEntryOptimistically: (
      mediaId: number,
      updates: OptimisticUpdateFields,
      type: "ANIME" | "MANGA",
   ) => void;
}

export type OptimisticUpdateFields = {
   status?: MediaListStatus;
   score?: number;
   progress?: number;
   progressVolumes?: number;
   repeat?: number;
   priority?: number;
   private?: boolean;
   notes?: string;
   hiddenFromStatusLists?: boolean;
   customLists?: string[];
   startedAt?: FuzzyDateInput;
   completedAt?: FuzzyDateInput;
};

export const useAuthStore = create<AuthState>()(
   persist(
      (set) => ({
         token: null,
         expiresAt: null,
         userProfile: null,
         userAnimeLibraryLists: null,
         userMangaLibraryLists: null,
         isLoggedIn: false,

         setToken: (token, expiresAt) => {
            set({ token, expiresAt, isLoggedIn: true });
         },

         setUserProfile: (data) => set({ userProfile: data }),

         setUserAnimeLibraryLists: (lists) => set({ userAnimeLibraryLists: lists }),
         setUserMangaLibraryLists: (lists) => set({ userMangaLibraryLists: lists }),

         logout: () => {
            set({
               token: null,
               expiresAt: null,
               isLoggedIn: false,
               userProfile: null,
               userAnimeLibraryLists: null,
               userMangaLibraryLists: null,
            });
         },

         updateEntryOptimistically: (mediaId, updates, type) => {
            set((state) => {
               const lists =
                  type === "ANIME" ? state.userAnimeLibraryLists : state.userMangaLibraryLists;

               if (!lists) return state;

               const updatedLists = lists.map((list) => ({
                  ...list,
                  entries: list?.entries?.map((entry) =>
                     entry?.media?.id === mediaId ? { ...entry, ...updates } : entry,
                  ),
               }));

               return type === "ANIME"
                  ? { userAnimeLibraryLists: updatedLists }
                  : { userMangaLibraryLists: updatedLists };
            });
         },
      }),
      {
         name: "auth-storage",
         storage: createJSONStorage(() => mmkvZustandStorage),
      },
   ),
);
