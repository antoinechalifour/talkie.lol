import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

import { useSoundActivityDetection } from "../../../../../hooks/useSoundActivityDetection";
import { StreamOptionsView } from "./StreamOptionsView/StreamOptionsView";
import { useUserMediaView } from "./useUserMediaView";
import { SpeakingIconContainer, UserMediaLayout, UserTopMenu } from "./styles";

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

      <UserTopMenu>
        <p>You</p>

        <SpeakingIconContainer>
          {isSpeaking && <FontAwesomeIcon icon={faVolumeUp} />}
        </SpeakingIconContainer>

        <StreamOptionsView videoId={videoId} userId={id} />
      </UserTopMenu>
    </UserMediaLayout>
  );
};
