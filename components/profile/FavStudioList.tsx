import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

import { UserProfile } from "@/types";

interface FavStudioListProps {
   profileData: UserProfile | null | undefined;
}

const FavStudioList = ({ profileData }: FavStudioListProps) => {
   if (
      !profileData?.favourites?.studios?.nodes ||
      profileData.favourites.studios.nodes.length === 0
   )
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Studios</Text>
         <FlashList
            data={profileData?.favourites?.studios?.nodes}
            renderItem={({ item }) => (
               <Text className="mr-3 rounded-md bg-slate-900/70 px-3 py-2 font-bold text-text-secondary">
                  {item?.name ?? "Name Unavailable"}
               </Text>
            )}
            keyExtractor={(item, index) => item?.id?.toString() ?? `studio-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};

export default FavStudioList;
