import { Text, View } from "react-native";

import { minutesToDays } from "@/lib/utils/date";
import { UserProfile } from "@/types";

interface StatsInfoProps {
   profileData: UserProfile | null | undefined;
}

const StatsInfo = ({ profileData }: StatsInfoProps) => {
   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Stats</Text>
         <View className="gap-2 rounded-md bg-slate-900/70 px-4 py-2">
            {/* total anime */}
            <View className="flex-row">
               <Text className="w-1/2 text-text-secondary">Total Anime</Text>
               <Text className="w-1/2 text-text-secondary">
                  {profileData?.statistics?.anime?.count ?? 0}
               </Text>
            </View>

            {/* ep watched */}
            <View className="flex-row">
               <Text className="w-1/2 text-text-secondary">Episodes Watched</Text>
               <Text className="w-1/2 text-text-secondary">
                  {profileData?.statistics?.anime?.episodesWatched ?? 0}
               </Text>
            </View>

            {/* days watched */}
            <View className="flex-row">
               <Text className="w-1/2 text-text-secondary">Days Watched</Text>
               <Text className="w-1/2 text-text-secondary">
                  {minutesToDays(profileData?.statistics?.anime?.minutesWatched ?? 0)}
               </Text>
            </View>

            {/* anime mean score */}
            <View className="flex-row">
               <Text className="w-1/2 text-text-secondary">Anime Mean Score</Text>
               <Text className="w-1/2 text-text-secondary">
                  {profileData?.statistics?.anime?.meanScore ?? 0}
               </Text>
            </View>

            {/* total manga */}
            <View className="flex-row">
               <Text className="w-1/2 text-text-secondary">Total Manga</Text>
               <Text className="w-1/2 text-text-secondary">
                  {profileData?.statistics?.manga?.count ?? 0}
               </Text>
            </View>

            {/* chapters read */}
            <View className="flex-row">
               <Text className="w-1/2 text-text-secondary">Chapters Read</Text>
               <Text className="w-1/2 text-text-secondary">
                  {profileData?.statistics?.manga?.chaptersRead ?? 0}
               </Text>
            </View>

            {/* manga mean score */}
            <View className="flex-row">
               <Text className="w-1/2 text-text-secondary">Manga Mean Score</Text>
               <Text className="w-1/2 text-text-secondary">
                  {profileData?.statistics?.manga?.meanScore ?? 0}
               </Text>
            </View>
         </View>
      </View>
   );
};

export default StatsInfo;
