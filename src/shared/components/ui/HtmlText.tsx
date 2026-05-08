import { Linking, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

interface HtmlTextProps {
   htmlContent: string;
   lineHeight?: number;
   textColor?: string;
   numberOfLines?: number | undefined;
}

export const HtmlText = ({
   htmlContent,
   lineHeight,
   textColor = "white",
   numberOfLines,
}: HtmlTextProps) => {
   const { width } = useWindowDimensions();

   return (
      <RenderHtml
         contentWidth={width}
         source={{ html: htmlContent }}
         baseStyle={{
            color: textColor,
            lineHeight: lineHeight ?? 18,
            overflow: "hidden",
         }}
         tagsStyles={{
            b: { color: textColor, fontWeight: "700" },
            strong: { color: textColor, fontWeight: "700" },
            i: { color: textColor, fontStyle: "italic" },
            em: { color: textColor, fontStyle: "italic" },
            p: { color: textColor, marginTop: 0, marginBottom: 8 },
            span: { color: textColor },
            a: { color: textColor, textDecorationLine: "underline" },
         }}
         renderersProps={{
            a: {
               onPress: (_, href) => {
                  if (href) {
                     void Linking.openURL(href);
                  }
               },
            },
            img: {
               enableExperimentalPercentWidth: true,
            },
         }}
         defaultTextProps={{
            numberOfLines: numberOfLines,
            ellipsizeMode: "tail",
         }}
      />
   );
};
