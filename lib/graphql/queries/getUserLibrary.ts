import { gql } from "@/lib/graphql/generated";

export const GetUserLibraryQuery = gql(/* GraphQL */ `
   query GetUserLibraryQuery($type: MediaType, $userId: Int) {
      MediaListCollection(type: $type, userId: $userId) {
         lists {
            name
            status
            entries {
               id
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
                  volumes
                  format
                  type
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
