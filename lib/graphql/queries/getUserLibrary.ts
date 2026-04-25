import { gql } from "@/lib/graphql/generated";

export const GetUserLibraryQuery = gql(/* GraphQL */ `
   query GetUserLibraryQuery($type: MediaType, $userId: Int) {
      MediaListCollection(type: $type, userId: $userId) {
         lists {
            name
            status
            entries {
               status
               progress
               media {
                  id
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     large
                  }
                  episodes
                  chapters
                  format
                  nextAiringEpisode {
                     episode
                     airingAt
                  }
               }
            }
         }
      }
   }
`);
