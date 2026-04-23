import { gql } from "@/lib/graphql/generated";

export const GetMediaByNameQuery = gql(/* GraphQL */ `
   query GetMediaByName($type: MediaType, $search: String) {
      Page(page: 1, perPage: 50) {
         media(type: $type, search: $search, sort: POPULARITY_DESC) {
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
         }
      }
   }
`);
