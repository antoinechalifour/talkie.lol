import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute } from "@fortawesome/free-solid-svg-icons";

import { RemotePeer } from "../RemotePeer";
import { VideoStreamBox } from "./VideoStreamBox";
import { AllMute, VideoBoxLayout } from "./styles";
import { AudioStreamBox } from "./AudioStreamBox";

export interface RemotePeerBoxProps {
  remotePeer: RemotePeer;
}

export const RemotePeerBox: React.FC<RemotePeerBoxProps> = ({ remotePeer }) => {
  return (
    <VideoBoxLayout>
      {remotePeer.isSharingVideo() ? (
        <VideoStreamBox mediaStream={remotePeer.mediaStream!} />
      ) : remotePeer.isSharingAudio() ? (
        <AudioStreamBox mediaStream={remotePeer.mediaStream!} />
      ) : (
        <AllMute>
          <FontAwesomeIcon icon={faVolumeMute} />
        </AllMute>
      )}
      <p>{remotePeer.name()}</p>
    </VideoBoxLayout>
  );
};
