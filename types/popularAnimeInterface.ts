export type PopularAnimeInterface = {
   data: {
      Page: {
         pageInfo: {
            hasNextPage: boolean;
            currentPage: number;
         };
         media: {
            id: number;
            title: {
               english: string;
               romaji: string;
            };
            averageScore: number;
            favourites: number;
            coverImage: {
               large: string;
            };
            bannerImage: string;
            description: string;
            genres: string[];
            studios: {
               nodes: {
                  id: number;
                  name: string;
               }[];
            };
         }[];
      };
   };
};
