import { gql } from "@/lib/graphql/generated";

export const GetPopularAnimeQuery = gql(`
   query GetPopularAnime($page: Int = 1) {
      Page(page: $page, perPage: 10) {
         pageInfo {
            hasNextPage
            currentPage
         }
         media(type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
               english
               romaji
            }
            averageScore
            favourites
            coverImage {
               large
            }
            bannerImage
            description
            genres
            studios(isMain: true) {
               nodes {
                  id
                  name
               }
            }
         }
      }
   }
`);
