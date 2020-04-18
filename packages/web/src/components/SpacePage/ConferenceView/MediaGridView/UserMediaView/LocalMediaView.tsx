import React from "react";

import { StreamOptionsView } from "./StreamOptionsView/StreamOptionsView";
import { useUserMediaView } from "./useUserMediaView";
import { UserMediaLayout, LocalNameView, UserVideo } from "./styles";

export interface LocalMediaViewProps {
  id: string;
  name: string;
  mediaStream: MediaStream;
}

export const LocalMediaView: React.FC<LocalMediaViewProps> = ({
  id,
  name,
  mediaStream,
}) => {
  const { videoId, hasVideo, videoRef } = useUserMediaView(id, mediaStream);

  return (
    <UserMediaLayout>
      {hasVideo && <UserVideo id={videoId} ref={videoRef} autoPlay muted />}

      <StreamOptionsView videoId={videoId} userId={id} />

      <LocalNameView>{name}</LocalNameView>
    </UserMediaLayout>
  );
};
