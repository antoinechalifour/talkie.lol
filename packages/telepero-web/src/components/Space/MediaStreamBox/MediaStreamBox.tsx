import React, { useEffect, useRef } from "react";
import { Video } from "./styles";

export interface MediaStreamBoxProps {
  mediaStream: MediaStream;
}

export const MediaStreamBox: React.FC<MediaStreamBoxProps> = ({
  mediaStream,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = mediaStream;
    videoRef.current.onloadedmetadata = () => videoRef.current!.play();
  }, [mediaStream]);

  return <Video ref={videoRef} autoPlay={true} />;
};
