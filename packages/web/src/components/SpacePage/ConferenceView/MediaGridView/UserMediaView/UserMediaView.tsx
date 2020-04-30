import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

import { useSoundActivityDetection } from "../../../../../hooks/useSoundActivityDetection";
import { Video } from "../../../../ui/Video/Video";
import { StreamOptionsView } from "./StreamOptionsView/StreamOptionsView";
import { useUserMediaView } from "./useUserMediaView";
import { SpeakingIconContainer, UserMediaLayout, UserTopMenu } from "./styles";

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
      {hasVideo && <Video id={videoId} ref={videoRef} autoPlay muted />}
      {hasAudio && <audio ref={audioRef} autoPlay />}

      <UserTopMenu>
        <p>{name}</p>

        <SpeakingIconContainer>
          {isSpeaking && <FontAwesomeIcon icon={faVolumeUp} />}
        </SpeakingIconContainer>

        <StreamOptionsView videoId={videoId} userId={id} />
      </UserTopMenu>
    </UserMediaLayout>
  );
};
