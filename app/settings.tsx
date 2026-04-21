import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useAuthStore } from "@/stores/authStore";

const Settings = () => {
   const { logout } = useAuthStore();

   return (
      <View className="w-full flex-1">
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         >
            <TouchableOpacity onPress={logout} className="">
               <View className="mx-auto mt-20">
                  <Text className="mx-auto rounded-lg bg-[#11212D] px-6 py-3 text-xl font-semibold text-white">
                     Logout
                  </Text>
               </View>
            </TouchableOpacity>
         </ScrollView>
      </View>
   );
};

export default Settings;
