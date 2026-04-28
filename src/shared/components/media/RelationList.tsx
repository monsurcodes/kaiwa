import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

import { SharedMedia } from "@/shared/types";

import RelationCard from "./Cards/RelationCard";

interface RelationListProps {
   media: SharedMedia | null | undefined;
}

const RelationList = ({ media }: RelationListProps) => {
   if (!media?.relations?.edges || media.relations.edges.length === 0) return;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-white">Relations</Text>
         <FlashList
            data={media?.relations?.edges}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
               <RelationCard
                  id={item?.node?.id ?? 0}
                  relationType={item?.relationType ?? ""}
                  type={item?.node?.type ?? ""}
                  format={item?.node?.format ?? ""}
                  title={
                     item?.node?.title?.english ?? item?.node?.title?.romaji ?? "Title Unavailable"
                  }
                  image={item?.node?.coverImage?.large ?? ""}
               />
            )}
         />
      </View>
   );
};

export default RelationList;
