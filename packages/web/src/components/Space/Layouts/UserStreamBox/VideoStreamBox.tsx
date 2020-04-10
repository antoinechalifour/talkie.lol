import React, { useEffect, useRef } from "react";
import { Video } from "./styles";

export interface UserStreamBoxProps {
  mediaStream: MediaStream;
  forceMute?: boolean;
}

export const VideoStreamBox: React.FC<UserStreamBoxProps> = ({
  mediaStream,
  forceMute,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return <Video ref={videoRef} autoPlay={true} muted={forceMute} />;
};
