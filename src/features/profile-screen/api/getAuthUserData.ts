import { gql } from "@/shared/lib/graphql/generated";

export const GetAuthUserDataQuery = gql(/* GraphQL */ `
   query GetAuthUserData {
      Viewer {
         id
         name
         about
         avatar {
            large
         }
         bannerImage
         statistics {
            anime {
               count
               episodesWatched
               minutesWatched
               meanScore
            }
            manga {
               count
               chaptersRead
               meanScore
            }
         }
         favourites {
            anime(page: 1, perPage: 10) {
               nodes {
                  id
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     large
                  }
               }
            }
            manga(page: 1, perPage: 10) {
               nodes {
                  id
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     extraLarge
                  }
               }
            }
            characters(page: 1, perPage: 10) {
               nodes {
                  id
                  name {
                     full
                  }
                  image {
                     large
                  }
               }
            }
            staff(page: 1, perPage: 10) {
               nodes {
                  id
                  name {
                     full
                  }
                  image {
                     large
                  }
               }
            }
            studios(page: 1, perPage: 10) {
               nodes {
                  id
                  name
               }
            }
         }
         mediaListOptions {
            animeList {
               customLists
               sectionOrder
            }
            mangaList {
               customLists
               sectionOrder
            }
            rowOrder
            scoreFormat
         }
      }
   }
`);
