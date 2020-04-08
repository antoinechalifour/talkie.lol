import React, { useEffect, useRef } from "react";
import { Video } from "./styles";

export interface UserStreamBoxProps {
  mediaStream: MediaStream;
}

export const VideoStreamBox: React.FC<UserStreamBoxProps> = ({
  mediaStream,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return <Video ref={videoRef} autoPlay={true} />;
};
