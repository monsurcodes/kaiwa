import { Tabs } from "expo-router";
import { BookOpen, Home, type LucideIcon, MessageSquare, Search, User } from "lucide-react-native";
import { View } from "react-native";

const TabBarIcon = ({ Icon, isFocused }: { Icon: LucideIcon; isFocused: boolean }) => {
   return (
      <View className="p-45 mt-2 size-full items-center justify-center rounded-full">
         <Icon size={24} color={isFocused ? "white" : "#9ca3af"} />
      </View>
   );
};

const Layout = () => {
   return (
      <Tabs
         screenOptions={{
            sceneStyle: {
               backgroundColor: "#030014",
               paddingHorizontal: 10,
            },
            tabBarItemStyle: {
               width: "100%",
               height: "100%",
               justifyContent: "center",
               alignItems: "center",
            },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#9ca3af",
            tabBarLabelStyle: {
               fontSize: 12,
               marginTop: 4,
            },
            tabBarStyle: {
               justifyContent: "center",
               alignItems: "center",
               height: 65,
               backgroundColor: "#0f0D23",
               borderTopWidth: 0, // removes the white line at the top of the tab bar
               paddingHorizontal: 10,
            },
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "Home",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => <TabBarIcon Icon={Home} isFocused={focused} />,
            }}
         />
         <Tabs.Screen
            name="library"
            options={{
               title: "Library",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => <TabBarIcon Icon={BookOpen} isFocused={focused} />,
            }}
         />
         <Tabs.Screen
            name="search"
            options={{
               title: "Search",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => <TabBarIcon Icon={Search} isFocused={focused} />,
            }}
         />
         <Tabs.Screen
            name="forum"
            options={{
               title: "Forum",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => <TabBarIcon Icon={MessageSquare} isFocused={focused} />,
            }}
         />
         <Tabs.Screen
            name="profile"
            options={{
               title: "Profile",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => <TabBarIcon Icon={User} isFocused={focused} />,
            }}
         />
      </Tabs>
   );
};

export default Layout;
