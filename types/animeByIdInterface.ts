export type AnimeByIdInterface = {
   data: {
      Media: {
         id: number;
         title: {
            english: string;
            romaji: string;
            native: string;
         };
         bannerImage: string;
         coverImage: {
            extraLarge: string;
         };
         description: string;
         averageScore: number;
         favourites: number;
         format: string;
         episodes: number;
         duration: number;
         genres: string[];
         season: string;
         source: string;
         status: string;
         trailer: {
            id: string;
            site: string;
            thumbnail: string;
         };
         startDate: {
            day: number;
            month: number;
            year: number;
         };
         endDate: {
            day: number;
            month: number;
            year: number;
         };
         characters: {
            edges: {
               role: string;
               node: {
                  id: number;
                  name: {
                     full: string;
                  };
                  image: {
                     large: string;
                  };
               };
            }[];
         };
         studios: {
            edges: {
               id: number;
               isMain: boolean;
               node: {
                  id: number;
                  name: string;
                  isAnimationStudio: boolean;
                  siteUrl: string;
               };
            }[];
         };
         relations: {
            edges: {
               id: number;
               relationType: string;
               node: {
                  id: number;
                  type: string;
                  title: {
                     english: string;
                     romaji: string;
                  };
                  coverImage: {
                     large: string;
                  };
               };
            }[];
         };
         recommendations: {
            nodes: {
               mediaRecommendation: {
                  id: number;
                  type: string;
                  title: {
                     english: string;
                     romaji: string;
                  };
                  coverImage: {
                     large: string;
                  };
               };
            }[];
         };
         nextAiringEpisode: {
            airingAt: number;
            timeUntilAiring: number;
            episode: number;
         };
         tags: {
            id: number;
            name: string;
            description: string;
            isMediaSpoiler: boolean;
         }[];
      };
   };
};
