import React, { useEffect, useRef, useState } from "react";
import { UserMediaLayout, UserNameView, UserVideo } from "./styles";

export interface UserMediaViewProps {
  name: string;
  mediaStream: MediaStream;
}

const hasMediaStreamVideo = (mediaStream: MediaStream) =>
  mediaStream.getVideoTracks().length > 0;
const hasMediaStreamAudio = (mediaStream: MediaStream) =>
  mediaStream.getAudioTracks().length > 0;

export const UserMediaView: React.FC<UserMediaViewProps> = ({
  name,
  mediaStream,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [{ hasAudio, hasVideo }, setHasAudioAndVideo] = useState(() => ({
    hasAudio: hasMediaStreamAudio(mediaStream),
    hasVideo: hasMediaStreamVideo(mediaStream),
  }));

  useEffect(() => {
    const onTracksChanged = (e: MediaStreamTrackEvent) => {
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

  return (
    <UserMediaLayout>
      {hasVideo && <UserVideo ref={videoRef} autoPlay muted />}
      {hasAudio && <audio ref={audioRef} autoPlay />}

      <UserNameView>{name}</UserNameView>
    </UserMediaLayout>
  );
};
