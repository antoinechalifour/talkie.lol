import React from "react";

import { VideoStreamBox } from "./VideoStreamBox";
import { AllMute, LocalVideoBoxLayout } from "./styles";
import { AudioStreamBox } from "./AudioStreamBox";

export interface LocalUserBoxProps {
  name: string;
  mediaStream: MediaStream | null;
}

export const LocalUserBox: React.FC<LocalUserBoxProps> = ({
  name,
  mediaStream,
}) => {
  const audioTracks = mediaStream?.getAudioTracks() || [];
  const videoTracks = mediaStream?.getVideoTracks() || [];

  const isSharingAudio = audioTracks.length > 0;
  const isSharingVideo = videoTracks.length > 0;

  return (
    <LocalVideoBoxLayout>
      {isSharingVideo ? (
        <VideoStreamBox mediaStream={mediaStream!} />
      ) : isSharingAudio ? (
        <AudioStreamBox mediaStream={mediaStream!} />
      ) : (
        <AllMute>
          <span role="img" aria-label="Your camera is disabled">
            🙈
          </span>{" "}
          <span role="img" aria-label="Your microphone is disabled">
            🤫
          </span>
        </AllMute>
      )}
      <p>{name} (you)</p>
    </LocalVideoBoxLayout>
  );
};
