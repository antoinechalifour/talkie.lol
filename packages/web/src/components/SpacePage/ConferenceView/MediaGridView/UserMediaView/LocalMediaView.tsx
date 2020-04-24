import React from "react";

import { useSoundActivityDetection } from "../../../../../hooks/useSoundActivityDetection";
import { StreamOptionsView } from "./StreamOptionsView/StreamOptionsView";
import { useUserMediaView } from "./useUserMediaView";
import { UserMediaLayout, UserTopMenu } from "./styles";

export interface LocalMediaViewProps {
  id: string;
  mediaStream: MediaStream;
}

export const LocalMediaView: React.FC<LocalMediaViewProps> = ({
  id,
  mediaStream,
}) => {
  const { videoId, hasVideo, videoRef } = useUserMediaView(id, mediaStream);
  const isSpeaking = useSoundActivityDetection(mediaStream);

  return (
    <UserMediaLayout>
      {hasVideo && <video id={videoId} ref={videoRef} autoPlay muted />}

      <UserTopMenu isActive={isSpeaking}>
        <p>You</p>

        <StreamOptionsView videoId={videoId} userId={id} />
      </UserTopMenu>
    </UserMediaLayout>
  );
};
