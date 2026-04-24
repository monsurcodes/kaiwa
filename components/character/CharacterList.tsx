import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";
import { CombinedError } from "urql";

import { CharacterEdge } from "@/types";

import CharacterCard from "./CharacterCard";

interface CharacterListProps {
   mediaId: number | null;
   characters: CharacterEdge[];
   fetching: boolean;
   error: CombinedError | undefined;
   loadMore: () => void;
}

const CharacterList = ({ mediaId, characters, fetching, error, loadMore }: CharacterListProps) => {
   if (error) console.error("Error fetching characters for media ID: ", mediaId, ":", error);
   if (!characters) return;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Characters</Text>
         <FlashList
            key={`characters-${mediaId ?? "unknown"}`}
            data={characters}
            className=""
            style={{ height: 185 }}
            horizontal
            keyExtractor={(item, index) =>
               item.node?.id ? item.node.id.toString() : `character-${index}`
            }
            renderItem={({ item }) => (
               <CharacterCard
                  id={item?.node?.id ?? 0}
                  name={item?.node?.name?.full ?? "Name Unavailable"}
                  image={item?.node?.image?.large ?? ""}
                  role={item?.role ?? ""}
               />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={
               fetching ? (
                  <View className="flex h-[120] w-[40] items-center justify-center">
                     <ActivityIndicator size="small" />
                  </View>
               ) : null
            }
         />
      </View>
   );
};

export default CharacterList;
