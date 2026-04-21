import { useCallback, useState } from "react";
import { View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface TrailerCardProps {
   videoId: string;
}

const TrailerCard = ({ videoId }: TrailerCardProps) => {
   const [playing, setPlaying] = useState(false);

   const onStateChange = useCallback((state: string) => {
      if (state === "ended") {
         setPlaying(false);
      }
   }, []);

   const [videoError, setVideoError] = useState(false);

   if (!videoId || videoError) {
      return null;
   }

   return (
      <View className="mb-8 w-full bg-slate-900">
         <YoutubePlayer
            height={220}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
            webViewProps={{
               allowsFullscreenVideo: true,
            }}
            onError={(error: any) => {
               console.warn("YouTube Player Error:", error);
               setVideoError(true);
            }}
         />
      </View>
   );
};

export default TrailerCard;
