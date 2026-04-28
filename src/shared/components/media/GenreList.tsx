import { FlashList } from "@shopify/flash-list";
import { Text } from "react-native";

import { SharedMedia } from "@/shared/types";

interface GenreListProps {
   media: SharedMedia | null | undefined;
}

const GenreList = ({ media }: GenreListProps) => {
   return (
      <FlashList
         data={media?.genres}
         horizontal
         showsHorizontalScrollIndicator={false}
         renderItem={({ item }) => (
            <Text className="mr-2 rounded-md bg-slate-700 px-2 py-1 text-xs text-white">
               {item}
            </Text>
         )}
      />
   );
};

export default GenreList;
