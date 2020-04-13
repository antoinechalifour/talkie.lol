import React from "react";

import { useVideoStream } from "../../../../hooks/useVideoStream";
import { Video } from "./styles";

export interface UserStreamBoxProps {
  id: string;
  mediaStream: MediaStream;
  forceMute?: boolean;
}

export const VideoStreamBox: React.FC<UserStreamBoxProps> = ({
  id,
  mediaStream,
  forceMute,
}) => {
  const { videoRef } = useVideoStream({ mediaStream });

  return <Video id={id} ref={videoRef} autoPlay={true} muted={forceMute} />;
};
