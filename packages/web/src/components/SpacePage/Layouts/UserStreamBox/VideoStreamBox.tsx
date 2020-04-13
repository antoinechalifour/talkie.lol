import React from "react";

import { useVideoStreamBox } from "./useVideoStreamBox";
import { Video } from "./styles";

export interface UserStreamBoxProps {
  mediaStream: MediaStream;
  forceMute?: boolean;
}

export const VideoStreamBox: React.FC<UserStreamBoxProps> = ({
  mediaStream,
  forceMute,
}) => {
  const { videoRef } = useVideoStreamBox({ mediaStream });

  return <Video ref={videoRef} autoPlay={true} muted={forceMute} />;
};
