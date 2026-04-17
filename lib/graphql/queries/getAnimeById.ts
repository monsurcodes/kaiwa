import { gql } from "urql";

export const GetAnimeByIdQuery = gql`
   query GetAnimeById($mediaId: Int) {
      Media(id: $mediaId, type: ANIME) {
         id
         title {
            english
            romaji
            native
         }
         bannerImage
         coverImage {
            extraLarge
         }
         description
         averageScore
         favourites
         format
         episodes
         duration
         genres
         season
         source
         status
         trailer {
            id
            site
            thumbnail
         }
         startDate {
            day
            month
            year
         }
         endDate {
            day
            month
            year
         }
         characters(sort: ROLE) {
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
         studios {
            edges {
               id
               isMain
               node {
                  id
                  name
                  isAnimationStudio
                  siteUrl
               }
            }
         }
         relations {
            edges {
               id
               relationType
               node {
                  id
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     large
                  }
                  type
               }
            }
         }
         nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
         }
         tags {
            name
            description
            isMediaSpoiler
            id
         }
         recommendations {
            nodes {
               mediaRecommendation {
                  id
                  type
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     large
                  }
               }
            }
         }
      }
   }
`;
