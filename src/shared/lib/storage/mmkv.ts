import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export const mmkvZustandStorage = {
   getItem: (name: string) => storage.getString(name) ?? null,
   setItem: (name: string, value: string) => storage.set(name, value),
   removeItem: (name: string) => storage.remove(name),
};
