import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

import { SharedMedia } from "@/shared/types";

import RecommendationCard from "./Cards/RecommendationCard";

interface RecommendationListProps {
   media: SharedMedia | null | undefined;
}

const RecommendationList = ({ media }: RecommendationListProps) => {
   if (!media?.recommendations?.nodes || media.recommendations.nodes.length === 0) return;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-white">Recommendations</Text>
         <FlashList
            data={media?.recommendations?.nodes}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
               <RecommendationCard
                  id={item?.mediaRecommendation?.id ?? 0}
                  type={item?.mediaRecommendation?.type ?? ""}
                  title={
                     item?.mediaRecommendation?.title?.english ??
                     item?.mediaRecommendation?.title?.romaji ??
                     "Title Unavailable"
                  }
                  image={item?.mediaRecommendation?.coverImage?.large ?? ""}
               />
            )}
         />
      </View>
   );
};

export default RecommendationList;
