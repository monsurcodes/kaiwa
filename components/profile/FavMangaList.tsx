import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

import { UserProfile } from "@/types";

import FavCard from "./Cards/FavCard";

interface FavMangaListProps {
   profileData: UserProfile | null | undefined;
}

const FavMangaList = ({ profileData }: FavMangaListProps) => {
   if (!profileData?.favourites?.manga?.nodes || profileData.favourites.manga.nodes.length === 0)
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Manga</Text>
         <FlashList
            data={profileData?.favourites?.manga?.nodes}
            renderItem={({ item }) => (
               <FavCard
                  id={item?.id ?? 0}
                  title={item?.title?.english ?? item?.title?.romaji ?? "Title Unavailable"}
                  image={item?.coverImage?.extraLarge ?? ""}
                  type="manga"
               />
            )}
            keyExtractor={(item, index) => item?.id?.toString() ?? `manga-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};

export default FavMangaList;
