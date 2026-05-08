import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { Text, View } from "react-native";

import { SharedMedia } from "../types";
import { TagCard } from "./Cards/TagCard";

interface TagListProps {
   media: SharedMedia | null | undefined;
}

export const TagList = ({ media }: TagListProps) => {
   const [revealedTagIds, setRevealedTagIds] = useState<number[]>([]);
   const handleRevealTag = (tagId: number) => {
      setRevealedTagIds((current) =>
         current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
      );
   };

   if (!media?.tags || media?.tags?.length <= 0) return;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-white">Tags</Text>
         <FlashList
            data={media?.tags}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id?.toString() ?? `tag-${index}`}
            renderItem={({ item }) => (
               <TagCard
                  id={item?.id ?? 0}
                  name={item?.name ?? "Name Unavailable"}
                  description={item?.description ?? "Description Unavailable"}
                  rank={item?.rank ?? 0}
                  spoiler={item?.isMediaSpoiler ?? false}
                  isRevealed={revealedTagIds.includes(item?.id ?? 0)}
                  onReveal={handleRevealTag}
               />
            )}
         />
      </View>
   );
};
