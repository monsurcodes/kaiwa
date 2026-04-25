import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

import { UserProfile } from "@/types";

import FavCard from "./Cards/FavCard";

interface FavAnimeListProps {
   profileData: UserProfile | null | undefined;
}

const FavAnimeList = ({ profileData }: FavAnimeListProps) => {
   if (!profileData?.favourites?.anime?.nodes || profileData.favourites.anime.nodes.length === 0)
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Anime</Text>
         <FlashList
            data={profileData?.favourites?.anime?.nodes}
            renderItem={({ item }) => (
               <FavCard
                  id={item?.id ?? 0}
                  title={item?.title?.english ?? item?.title?.romaji ?? "Title Unavailable"}
                  image={item?.coverImage?.large ?? ""}
                  type="anime"
               />
            )}
            keyExtractor={(item, index) => item?.id?.toString() ?? `anime-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};

export default FavAnimeList;
