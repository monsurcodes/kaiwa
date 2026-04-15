export type AuthUserDataInterface = {
   data: {
      Viewer: {
         id: number;
         name: string;
         about: string;
         avatar: {
            large: string;
         };
         bannerImage: string;
         statistics: {
            anime: {
               count: number;
               episodesWatched: number;
               minutesWatched: number;
               meanScore: number;
            };
            manga: {
               count: number;
               chaptersRead: number;
               meanScore: number;
            };
         };
         favourites: {
            anime: {
               nodes: {
                  id: number;
                  title: {
                     english: string;
                     romaji: string;
                  };
                  coverImage: {
                     large: string;
                  };
               }[];
            };
            manga: {
               nodes: {
                  id: number;
                  title: {
                     english: string;
                     romaji: string;
                  };
                  coverImage: {
                     extraLarge: string;
                  };
               }[];
            };
            characters: {
               nodes: {
                  id: number;
                  name: {
                     full: string;
                  };
                  image: {
                     large: string;
                  };
               }[];
            };
            staff: {
               nodes: {
                  id: number;
                  name: {
                     full: string;
                  };
                  image: {
                     large: string;
                  };
               }[];
            };
            studios: {
               nodes: {
                  id: number;
                  name: string;
               }[];
            };
         };
      };
   };
};
