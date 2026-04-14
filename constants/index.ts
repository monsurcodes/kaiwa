export const ANILIST_CLIENT_ID = process.env.EXPO_PUBLIC_ANILIST_CLIENT_ID;
export const ANILIST_CLIENT_SECRET = process.env.EXPO_PUBLIC_ANILIST_CLIENT_SECRET;
export const ANILIST_REDIRECT_URI = process.env.EXPO_PUBLIC_ANILIST_REDIRECT_URI;

export const ANILIST_API_URL = "https://graphql.anilist.co";

export const STORAGE_KEYS = {
   AUTH_TOKEN: "auth.token",
   AUTH_EXPIRES_AT: "auth.expiresAt",
   USER: "auth.user",
} as const;
