import { useCallback, useState } from "react";
import { View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

import { SharedMedia } from "../types";

interface TrailerCardProps {
   media: SharedMedia | null | undefined;
}

export const TrailerCard = ({ media }: TrailerCardProps) => {
   const [playing, setPlaying] = useState(false);

   const onStateChange = useCallback((state: string) => {
      if (state === "ended") {
         setPlaying(false);
      }
   }, []);

   const [videoError, setVideoError] = useState(false);

   if (!media?.trailer || media.trailer.site !== "youtube" || !media.trailer.id || videoError)
      return;

   return (
      <View className="mb-2 w-full bg-slate-900">
         <YoutubePlayer
            height={220}
            play={playing}
            videoId={media.trailer.id}
            onChangeState={onStateChange}
            webViewProps={{
               allowsFullscreenVideo: true,
            }}
            onError={() => {
               setVideoError(true);
            }}
         />
      </View>
   );
};
