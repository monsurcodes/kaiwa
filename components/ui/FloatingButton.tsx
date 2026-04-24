import { LucideIcon } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FloatingButtonProps {
   Icon: LucideIcon;
   strokeWidth?: number;
   onPress: () => void;
}

const FloatingButton = ({ Icon, strokeWidth, onPress }: FloatingButtonProps) => {
   return (
      <TouchableOpacity
         activeOpacity={0.8}
         onPress={onPress}
         style={styles.button}
         className="items-center justify-center rounded-lg shadow-lg shadow-slate-500/50"
      >
         <Icon color="#CCD0CF" size={32} strokeWidth={strokeWidth} />
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      position: "absolute",
      bottom: 24,
      right: 24,
      zIndex: 50,
      width: 45,
      height: 45,
      elevation: 8,
      backgroundColor: "#11212D",
   },
});

export default FloatingButton;
