import { gql } from "@/lib/graphql/generated";

export const GetMediaCharactersQuery = gql(/* GraphQL */ `
   query getMediaCharacters($mediaId: Int, $page: Int) {
      Media(id: $mediaId) {
         characters(sort: ROLE, page: $page, perPage: 10) {
            pageInfo {
               currentPage
               hasNextPage
            }
            edges {
               role
               node {
                  id
                  name {
                     full
                  }
                  image {
                     large
                  }
               }
            }
         }
      }
   }
`);
