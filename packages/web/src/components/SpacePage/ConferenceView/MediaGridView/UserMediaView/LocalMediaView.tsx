import React from "react";

import { useUserMediaView } from "./useUserMediaView";
import { UserMediaLayout, LocalNameView, UserVideo } from "./styles";

export interface LocalMediaViewProps {
  name: string;
  mediaStream: MediaStream;
}

export const LocalMediaView: React.FC<LocalMediaViewProps> = ({
  name,
  mediaStream,
}) => {
  const { hasVideo, videoRef } = useUserMediaView(mediaStream);

  return (
    <UserMediaLayout>
      {hasVideo && <UserVideo ref={videoRef} autoPlay muted />}

      <LocalNameView>{name}</LocalNameView>
    </UserMediaLayout>
  );
};
