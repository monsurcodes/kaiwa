import { gql } from "@/lib/graphql/generated";

export const SearchTrendingMediaQuery = gql(/* GraphQL */ `
   query SearchTrendingMedia($type: MediaType, $page: Int) {
      Page(perPage: 10, page: $page) {
         media(sort: POPULARITY_DESC, type: $type) {
            id
            title {
               english
               romaji
            }
            coverImage {
               large
            }
            genres
            format
            averageScore
            seasonYear
            favourites
            episodes
            chapters
            type
            mediaListEntry {
               status
            }
         }
      }
   }
`);
