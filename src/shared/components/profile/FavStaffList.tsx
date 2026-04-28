import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";

import { UserProfile } from "@/shared/types";

import FavCard from "./Cards/FavCard";

interface FavStaffListProps {
   profileData: UserProfile | null | undefined;
}

const FavStaffList = ({ profileData }: FavStaffListProps) => {
   if (!profileData?.favourites?.staff?.nodes || profileData.favourites.staff.nodes.length === 0)
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Staff</Text>
         <FlashList
            data={profileData?.favourites?.staff?.nodes}
            renderItem={({ item }) => (
               <FavCard
                  id={item?.id ?? 0}
                  title={item?.name?.full ?? "Name Unavailable"}
                  image={item?.image?.large ?? ""}
                  type="staff"
               />
            )}
            keyExtractor={(item, index) => item?.id?.toString() ?? `staff-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};

export default FavStaffList;
