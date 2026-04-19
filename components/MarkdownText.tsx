import { Image } from "expo-image"; //
import React from "react";
import { StyleSheet, View } from "react-native";
import Markdown, { RenderRules } from "react-native-markdown-display";

interface MarkdownTextProps {
   content: string;
}

const rules: RenderRules = {
   image: (node, children, parent, styles) => {
      const { src, alt } = node.attributes;

      // Decode AniList HTML entities so the URL is valid for the fetcher
      const decodedSrc = src
         .replace(/&#039;/g, "'")
         .replace(/&quot;/g, '"')
         .replace(/&amp;/g, "&");

      return (
         <Image
            key={node.key}
            source={decodedSrc} // expo-image handles SVG URLs automatically
            style={{
               width: "100%",
               height: 150, // Match the aspect ratio of your Lanyard banner
               borderRadius: 12,
               marginVertical: 10,
               backgroundColor: "#1e293b",
            }}
            contentFit="contain"
            transition={300} // Smooth fade-in when the SVG loads
            accessibilityLabel={alt}
         />
      );
   },
   link: (node, children, parent, styles) => {
      return (
         <View key={node.key} style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {children}
         </View>
      );
   },
};

const MarkdownText = ({ content }: MarkdownTextProps) => {
   const safeContent = content || "";

   return (
      <Markdown rules={rules} style={markdownStyles}>
         {safeContent}
      </Markdown>
   );
};

const markdownStyles = StyleSheet.create({
   body: { color: "white", fontSize: 16 },
   link: { color: "#3b82f6" },
});

export default MarkdownText;
