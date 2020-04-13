import React from "react";

import { useVideoStream } from "../../../../hooks/useVideoStream";
import { Video } from "./styles";

export interface UserStreamBoxProps {
  mediaStream: MediaStream;
  forceMute?: boolean;
}

export const VideoStreamBox: React.FC<UserStreamBoxProps> = ({
  mediaStream,
  forceMute,
}) => {
  const { videoRef } = useVideoStream({ mediaStream });

  return <Video ref={videoRef} autoPlay={true} muted={forceMute} />;
};
