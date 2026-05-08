import { useState } from "react";
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from "react-native";

import { HtmlText } from "@/shared/components/ui/HtmlText";
import { theme } from "@/shared/constants/theme";

const isNewArchitectureEnabled = Boolean(
   (global as typeof globalThis & { nativeFabricUIManager?: unknown }).nativeFabricUIManager,
);

if (
   Platform.OS === "android" &&
   !isNewArchitectureEnabled &&
   UIManager.setLayoutAnimationEnabledExperimental
) {
   UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const SynopsisCard = ({ text }: { text: string | null | undefined }) => {
   const [isExpanded, setIsExpanded] = useState(false);

   const toggleExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(!isExpanded);
   };

   if (!text) return;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Synopsis</Text>
         <Pressable onPress={toggleExpand} className="rounded-md bg-slate-900/70 px-4 py-2">
            <HtmlText
               htmlContent={text}
               numberOfLines={isExpanded ? undefined : 4}
               textColor={theme.text.secondary}
            />

            <Text className="mt-1 text-xs font-bold text-text-primary">
               {isExpanded ? "Show Less" : "Read More..."}
            </Text>
         </Pressable>
      </View>
   );
};
