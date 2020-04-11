import { useEffect, useRef } from "react";

interface UseAudioStreamBoxOptions {
  mediaStream: MediaStream;
}

export const useAudioStreamBox = ({
  mediaStream,
}: UseAudioStreamBoxOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return { audioRef };
};
