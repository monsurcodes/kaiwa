import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { storage } from "@/lib/storage/mmkv";

interface User {
   id: number;
   name: string;
   avatar: string;
}

interface AuthState {
   token: string | null;
   expiresAt: number | null;
   user: User | null;
   isLoggedIn: boolean;
   setToken: (token: string, expiresAt: number) => void;
   setUser: (user: User | null) => void;
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
         user: null,
         isLoggedIn: false,

         setToken: (token, expiresAt) => set({ token, expiresAt, isLoggedIn: true }),

         setUser: (user) => set({ user }),

         logout: () => set({ token: null, expiresAt: null, user: null, isLoggedIn: false }),
      }),
      {
         name: "auth-storage", // The master key in MMKV
         storage: createJSONStorage(() => mmkvStorage),
         // Optional: Only persist specific fields
         partialize: (state) => ({
            token: state.token,
            expiresAt: state.expiresAt,
            user: state.user,
            isLoggedIn: state.isLoggedIn,
         }),
      },
   ),
);
