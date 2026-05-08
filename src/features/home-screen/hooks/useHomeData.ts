import { useEffect } from "react";
import { useQuery } from "urql";

import { compareTimestampTodayFirstTomorrowLast, isTimestampToday } from "@/shared/lib/utils/date";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";

import { GetPopularAnimeQuery } from "../api/getPopularAnime";
import { GetTrendingAnimeQuery } from "../api/getTrendingAnime";
import { GetTrendingMangaQuery } from "../api/getTrendingManga";

export const useHomeData = () => {
   const {
      trendingAnime,
      popularAnime,
      trendingManga,
      setTrendingAnime,
      setPopularAnime,
      setTrendingManga,
   } = useDataStore();

   const { userAnimeLibraryLists } = useAuthStore();

   const [animeResult] = useQuery({
      query: GetTrendingAnimeQuery,
      pause: Boolean(trendingAnime),
   });

   const [popularAnimeResult] = useQuery({
      query: GetPopularAnimeQuery,
      pause: Boolean(popularAnime),
   });

   const [mangaResult] = useQuery({
      query: GetTrendingMangaQuery,
      pause: Boolean(trendingManga),
   });

   useEffect(() => {
      const media = animeResult.data?.Page?.media;
      if (media && !trendingAnime) setTrendingAnime(media);
   }, [animeResult.data]); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      const media = popularAnimeResult.data?.Page?.media;
      if (media && !popularAnime) setPopularAnime(media);
   }, [popularAnimeResult.data]); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      const media = mangaResult.data?.Page?.media;
      if (media && !trendingManga) setTrendingManga(media);
   }, [mangaResult.data]); // eslint-disable-line react-hooks/exhaustive-deps

   const trendingAnimeData = trendingAnime ?? animeResult.data?.Page?.media;
   const popularAnimeData = popularAnime ?? popularAnimeResult.data?.Page?.media;
   const trendingMangaData = trendingManga ?? mangaResult.data?.Page?.media;

   const entries = userAnimeLibraryLists
      ?.flatMap((list) => list?.entries ?? [])
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

   const releasingEntries = entries
      ?.filter((entry) => isTimestampToday(entry?.media?.nextAiringEpisode?.airingAt))
      .sort((a, b) =>
         compareTimestampTodayFirstTomorrowLast(
            a?.media?.nextAiringEpisode?.airingAt,
            b?.media?.nextAiringEpisode?.airingAt,
         ),
      );

   const isInitialLoading =
      (!trendingAnime && animeResult.fetching) ||
      (!popularAnime && popularAnimeResult.fetching) ||
      (!trendingManga && mangaResult.fetching);

   return {
      trendingAnimeData,
      popularAnimeData,
      trendingMangaData,
      releasingEntries,
      isInitialLoading,
   };
};
