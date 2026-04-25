import { Text, View } from "react-native";

import MarkdownText from "../ui/MarkdownText";

interface AboutCardProps {
   aboutText: string | null | undefined;
}

const AboutCard = ({ aboutText }: AboutCardProps) => {
   if (!aboutText) return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">About</Text>
         <MarkdownText content={aboutText} />
      </View>
   );
};

export default AboutCard;
