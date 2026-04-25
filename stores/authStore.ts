import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { storage } from "@/lib/storage/mmkv";
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
}

// Custom storage bridge for MMKV and Zustand Persist
const mmkvStorage = {
   getItem: (name: string) => storage.getString(name) ?? null,
   setItem: (name: string, value: string) => storage.set(name, value),
   removeItem: (name: string) => storage.remove(name),
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
            storage.remove("auth-storage");
            set({ token, expiresAt, isLoggedIn: true });
         },

         setUserProfile: (data) => set({ userProfile: data }),

         setUserAnimeLibraryLists: (lists) => set({ userAnimeLibraryLists: lists }),
         setUserMangaLibraryLists: (lists) => set({ userMangaLibraryLists: lists }),

         logout: () => {
            set({ token: null, expiresAt: null, isLoggedIn: false, userProfile: null });
            storage.remove("auth-storage");
         },
      }),
      {
         name: "auth-storage",
         storage: createJSONStorage(() => mmkvStorage),
      },
   ),
);
