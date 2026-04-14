import React from "react";
import { Text, View } from "react-native";
import { gql, useQuery } from "urql";
// import {FlashList} from "@shopify/flash-list"

const query = gql`
   query GetAnime {
      Page(page: 1, perPage: 10) {
         media(type: ANIME, sort: TRENDING_DESC) {
            id
            title {
               romaji
               english
            }
         }
      }
   }
`;

const Index = () => {
   const [result] = useQuery({
      query: query,
   });

   const { data, fetching, error } = result;

   return (
      <View className="flex-1">
         <Text className="text-3xl text-emerald-500">Home screen</Text>

         {fetching && <Text className="text-white">Loading...</Text>}
         {error && (
            <Text className="text-red-500">
               Error: {error.graphQLErrors[0]?.message || error.message}
            </Text>
         )}
         {data && <Text className="text-white">{JSON.stringify(data)}</Text>}
         {/* {data && (
            <FlashList
               data={data.Page.media}
               renderItem={({ item }) => (
                  <Text className="text-white">{item.title.romaji as string}</Text>
               )}
               keyExtractor={(item) => item.id.toString()}
            />
         )} */}
      </View>
   );
};

export default Index;
