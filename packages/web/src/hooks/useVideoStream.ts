import { useEffect, useRef } from "react";

interface UseVideoStreamBoxOptions {
  mediaStream: MediaStream;
}

export function useVideoStream({ mediaStream }: UseVideoStreamBoxOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return { videoRef };
}
