import { useEffect, useRef } from "react";

interface UseVideoStreamBoxOptions {
  mediaStream: MediaStream;
}

export function useVideoStreamBox({ mediaStream }: UseVideoStreamBoxOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = mediaStream;

    const onAddTrack = () => videoRef.current?.play();
    const onRemoveTrack = () => videoRef.current?.pause();

    mediaStream.addEventListener("addtrack", onAddTrack);
    mediaStream.addEventListener("removetrack", onRemoveTrack);

    return () => {
      mediaStream.removeEventListener("addtrack", onAddTrack);
      mediaStream.removeEventListener("removetrack", onRemoveTrack);
    };
  }, [mediaStream]);

  return { videoRef };
}
