import React from "react";

import { StreamOptionsView } from "./StreamOptionsView/StreamOptionsView";
import { useUserMediaView } from "./useUserMediaView";
import { UserMediaLayout, UserNameView, UserVideo } from "./styles";

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

  return (
    <UserMediaLayout>
      {hasVideo && <UserVideo id={videoId} ref={videoRef} autoPlay muted />}
      {hasAudio && <audio ref={audioRef} autoPlay />}

      <StreamOptionsView videoId={videoId} />

      <UserNameView>{name}</UserNameView>
    </UserMediaLayout>
  );
};
