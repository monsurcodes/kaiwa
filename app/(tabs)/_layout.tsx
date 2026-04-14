import { Tabs } from "expo-router";
import { BookOpen, Home, MessageSquare, User } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

const Layout = () => {
   return (
      <Tabs
         screenOptions={{
            sceneStyle: {
               backgroundColor: "#030014",
               padding: 1,
            },
            tabBarItemStyle: {
               width: "100%",
               height: "100%",
               justifyContent: "center",
               alignItems: "center",
            },
            tabBarLabelStyle: {
               fontSize: 12,
            },
            tabBarStyle: {
               justifyContent: "center",
               alignItems: "center",
               marginBottom: 20,
               marginHorizontal: 20,
               borderRadius: 20,
               height: 60,
               position: "absolute",
               overflow: "hidden",
               backgroundColor: "#0f0D23",
               borderTopWidth: 0, // removes the white line at the top of the tab bar
               shadowColor: "#000",
               shadowOffset: {
                  width: 0,
                  height: 2,
               },
               shadowOpacity: 0.25,
               shadowRadius: 3.84,
               elevation: 5,
            },
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "Home",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => (
                  <View className="mt-2 size-full items-center justify-center rounded-full">
                     <Home size={24} color={focused ? "#4ade80" : "#9ca3af"} />
                  </View>
               ),
            }}
         />
         <Tabs.Screen
            name="library"
            options={{
               title: "Library",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => (
                  <View className="mt-2 size-full items-center justify-center rounded-full">
                     <BookOpen size={24} color={focused ? "#4ade80" : "#9ca3af"} />
                  </View>
               ),
            }}
         />
         <Tabs.Screen
            name="forum"
            options={{
               title: "Forum",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => (
                  <View className="mt-2 size-full items-center justify-center rounded-full">
                     <MessageSquare size={24} color={focused ? "#4ade80" : "#9ca3af"} />
                  </View>
               ),
            }}
         />
         <Tabs.Screen
            name="profile"
            options={{
               title: "Profile",
               headerShown: false,
               animation: "shift",
               tabBarIcon: ({ focused }) => (
                  <View className="mt-2 size-full items-center justify-center rounded-full">
                     <User size={24} color={focused ? "#4ade80" : "#9ca3af"} />
                  </View>
               ),
            }}
         />
      </Tabs>
   );
};

export default Layout;
