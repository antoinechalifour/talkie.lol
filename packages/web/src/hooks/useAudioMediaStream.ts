import { useCallback, useEffect, useRef, useState } from "react";

interface AudioMediaStreamContext {
  audioContext: AudioContext;
  source: MediaStreamAudioSourceNode;
}

export const useAudioMediaStream = (mediaStream: MediaStream) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef<AudioMediaStreamContext | null>(null);

  const initializeAudioPlayer = useCallback(() => {
    ref.current?.audioContext.close();

    if (mediaStream.getAudioTracks().length === 0) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);

    source.connect(audioContext.destination);
    setIsPlaying(true);

    ref.current = {
      audioContext,
      source,
    };
  }, [mediaStream]);

  const toggle = useCallback(() => {
    const context = ref.current;

    if (!context) return;

    if (isPlaying) {
      context.source.disconnect();
      setIsPlaying(false);
    } else {
      context.source.connect(context.audioContext.destination);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    mediaStream.addEventListener("addtrack", initializeAudioPlayer);
    mediaStream.addEventListener("removetrack", initializeAudioPlayer);

    initializeAudioPlayer();

    return () => {
      ref.current?.audioContext.close();

      mediaStream.removeEventListener("addtrack", initializeAudioPlayer);
      mediaStream.removeEventListener("removetrack", initializeAudioPlayer);
    };
  }, [initializeAudioPlayer, mediaStream]);

  return {
    isPlaying,
    toggle,
  };
};
