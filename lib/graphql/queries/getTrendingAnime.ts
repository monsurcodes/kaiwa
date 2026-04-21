import { gql } from "@/lib/graphql/generated";

export const GetTrendingAnimeQuery = gql(`
   query GetTrendingAnime($page: Int = 1) {
      Page(page: $page, perPage: 10) {
         pageInfo {
            hasNextPage
            currentPage
         }
         media(type: ANIME, sort: TRENDING_DESC) {
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
