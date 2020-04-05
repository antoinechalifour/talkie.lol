import React, { useEffect, useRef } from "react";

export interface LocalVideoProps {
  mediaStream: MediaStream;
}

export const Video: React.FC<LocalVideoProps> = ({ mediaStream }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = mediaStream;
    videoRef.current.onloadedmetadata = () => videoRef.current!.play()
  }, [mediaStream]);

  return (
    <video
      style={{
        background: "gray",
        width: "850px",
        border: "1px solid dark",
      }}
      ref={videoRef}
      autoPlay={true}
    />
  );
};
