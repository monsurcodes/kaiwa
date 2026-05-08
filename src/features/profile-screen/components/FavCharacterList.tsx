import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

import { UserProfile } from "../types";
import { FavCard } from "./Cards/FavCard";

interface FavCharacterListProps {
   profileData: UserProfile | null | undefined;
}

export const FavCharacterList = ({ profileData }: FavCharacterListProps) => {
   if (
      !profileData?.favourites?.characters?.nodes ||
      profileData.favourites.characters.nodes.length === 0
   )
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Characters</Text>
         <FlashList
            data={profileData?.favourites?.characters?.nodes}
            renderItem={({ item }) => (
               <FavCard
                  id={item?.id ?? 0}
                  title={item?.name?.full ?? "Name Unavailable"}
                  image={item?.image?.large ?? ""}
                  type="character"
               />
            )}
            keyExtractor={(item, index) => item?.id?.toString() ?? `character-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};
