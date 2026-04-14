import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AuthCallback() {
   useEffect(() => {}, []);

   return (
      <View style={{ flex: 1, backgroundColor: "#030014", justifyContent: "center" }}>
         <ActivityIndicator color="#10b981" />
      </View>
   );
}
