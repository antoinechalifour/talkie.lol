import React from "react";

import { useUserMediaView } from "./useUserMediaView";
import { UserMediaLayout, UserNameView, UserVideo } from "./styles";

export interface UserMediaViewProps {
  name: string;
  mediaStream: MediaStream;
}

export const UserMediaView: React.FC<UserMediaViewProps> = ({
  name,
  mediaStream,
}) => {
  const { hasAudio, audioRef, hasVideo, videoRef } = useUserMediaView(
    mediaStream
  );

  return (
    <UserMediaLayout>
      {hasVideo && <UserVideo ref={videoRef} autoPlay muted />}
      {hasAudio && <audio ref={audioRef} autoPlay />}

      <UserNameView>{name}</UserNameView>
    </UserMediaLayout>
  );
};
