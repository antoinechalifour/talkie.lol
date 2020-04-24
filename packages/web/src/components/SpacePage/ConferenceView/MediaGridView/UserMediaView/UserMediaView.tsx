import React from "react";

import { useSoundActivityDetection } from "../../../../../hooks/useSoundActivityDetection";
import { StreamOptionsView } from "./StreamOptionsView/StreamOptionsView";
import { useUserMediaView } from "./useUserMediaView";
import { UserMediaLayout, UserTopMenu } from "./styles";

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
    <UserMediaLayout>
      {hasVideo && <video id={videoId} ref={videoRef} autoPlay muted />}
      {hasAudio && <audio ref={audioRef} autoPlay />}

      <UserTopMenu isActive={isSpeaking}>
        <p>{name}</p>

        <StreamOptionsView videoId={videoId} userId={id} />
      </UserTopMenu>
    </UserMediaLayout>
  );
};
