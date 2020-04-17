import { useEffect, useRef, useState } from "react";

const hasMediaStreamVideo = (mediaStream: MediaStream) =>
  mediaStream.getVideoTracks().length > 0;
const hasMediaStreamAudio = (mediaStream: MediaStream) =>
  mediaStream.getAudioTracks().length > 0;

export const useUserMediaView = (mediaStream: MediaStream) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [{ hasAudio, hasVideo }, setHasAudioAndVideo] = useState(() => ({
    hasAudio: hasMediaStreamAudio(mediaStream),
    hasVideo: hasMediaStreamVideo(mediaStream),
  }));

  useEffect(() => {
    const onTracksChanged = () => {
      const hasVideo = hasMediaStreamVideo(mediaStream);
      const hasAudio = hasMediaStreamAudio(mediaStream);

      setHasAudioAndVideo({
        hasAudio,
        hasVideo,
      });
    };

    mediaStream.addEventListener("addtrack", onTracksChanged);
    mediaStream.addEventListener("removetrack", onTracksChanged);

    return () => {
      mediaStream.removeEventListener("addtrack", onTracksChanged);
      mediaStream.removeEventListener("removetrack", onTracksChanged);
    };
  }, [mediaStream]);

  useEffect(() => {
    if (videoRef.current === null) return;

    if (hasVideo) videoRef.current.srcObject = mediaStream;
    else videoRef.current.srcObject = null;
  }, [hasVideo, mediaStream]);

  useEffect(() => {
    if (audioRef.current === null) return;

    if (hasAudio) audioRef.current.srcObject = mediaStream;
    else audioRef.current.srcObject = null;
  }, [hasAudio, mediaStream]);

  return {
    hasAudio,
    audioRef,
    hasVideo,
    videoRef,
  };
};
