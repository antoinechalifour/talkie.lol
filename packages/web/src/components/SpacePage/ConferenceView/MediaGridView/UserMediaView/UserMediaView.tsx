import React from "react";

import { StreamOptionsView } from "./StreamOptionsView/StreamOptionsView";
import { useUserMediaView } from "./useUserMediaView";
import { UserMediaLayout, UserNameView, UserVideo } from "./styles";
import { useSoundActivityDetection } from "../../../../../hooks/useSoundActivityDetection";

export interface UserMediaViewProps {
  id: string;
  name: string;
  mediaStream: MediaStream;
}

export const UserMediaView: React.FC<UserMediaViewProps> = ({
  id,
  name,
  mediaStream,
}) => {
  const { videoId, hasAudio, audioRef, hasVideo, videoRef } = useUserMediaView(
    id,
    mediaStream
  );
  const isSpeaking = useSoundActivityDetection(mediaStream);

  return (
    <UserMediaLayout isActive={isSpeaking}>
      {hasVideo && <UserVideo id={videoId} ref={videoRef} autoPlay muted />}
      {hasAudio && <audio ref={audioRef} autoPlay />}

      <StreamOptionsView videoId={videoId} userId={id} />

      <UserNameView>{name}</UserNameView>
    </UserMediaLayout>
  );
};
