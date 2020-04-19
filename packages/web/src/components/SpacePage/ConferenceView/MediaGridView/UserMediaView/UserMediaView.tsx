import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

import { useSoundActivityDetection } from "../../../../../hooks/useSoundActivityDetection";
import { useAudioMediaStream } from "../../../../../hooks/useAudioMediaStream";
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
  const { videoId, hasVideo, videoRef } = useUserMediaView(id, mediaStream);
  const isSpeaking = useSoundActivityDetection(mediaStream);

  const { isPlaying, toggle } = useAudioMediaStream(mediaStream);

  return (
    <UserMediaLayout isActive={isSpeaking}>
      {hasVideo && <UserVideo id={videoId} ref={videoRef} autoPlay muted />}

      <StreamOptionsView videoId={videoId} userId={id} />

      <UserNameView>
        <span>{name}</span>

        <button onClick={toggle} aria-label="Toggle audio for this user">
          <FontAwesomeIcon
            icon={isPlaying ? faMicrophone : faMicrophoneSlash}
          />
        </button>
      </UserNameView>
    </UserMediaLayout>
  );
};
