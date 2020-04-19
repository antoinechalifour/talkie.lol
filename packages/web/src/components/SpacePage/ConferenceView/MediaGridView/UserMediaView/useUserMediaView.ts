import { useEffect, useRef, useState } from "react";

const hasMediaStreamVideo = (mediaStream: MediaStream) =>
  mediaStream.getVideoTracks().length > 0;

export const useUserMediaView = (id: string, mediaStream: MediaStream) => {
  const videoId = `stream-${id}`;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasVideo, setHasVideo] = useState(hasMediaStreamVideo(mediaStream));

  useEffect(() => {
    const onTracksChanged = () => setHasVideo(hasMediaStreamVideo(mediaStream));

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

  return {
    videoId,
    hasVideo,
    videoRef,
  };
};
