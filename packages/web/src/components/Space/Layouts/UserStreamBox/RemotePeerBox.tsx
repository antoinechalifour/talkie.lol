import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeMute,
  faBug,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { RemotePeer } from "../../models/RemotePeer";
import { VideoStreamBox } from "./VideoStreamBox";
import {
  AllMute,
  DebugButton,
  ExpandButton,
  RemotePeerInfo,
  VideoBoxLayout,
} from "./styles";
import { AudioStreamBox } from "./AudioStreamBox";

export interface RemotePeerBoxProps {
  remotePeer: RemotePeer;
  onSelect: (remotePeer: RemotePeer) => void;
}

export const RemotePeerBox: React.FC<RemotePeerBoxProps> = ({
  remotePeer,
  onSelect,
}) => {
  function debug() {
    toast.info(`${remotePeer.name()}'s info has been printed in the console`);
    console.group(remotePeer.id());
    console.table(remotePeer.user);
    console.table(remotePeer.mediaStream);
    // @ts-ignore
    console.table(remotePeer.connection);
    console.groupEnd();
  }

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

      <ExpandButton onClick={() => onSelect(remotePeer)}>
        <FontAwesomeIcon icon={faExpand} />
      </ExpandButton>

      <RemotePeerInfo>
        <p>{remotePeer.name()}</p>

        <DebugButton onClick={debug}>
          <FontAwesomeIcon icon={faBug} />
        </DebugButton>
      </RemotePeerInfo>
    </VideoBoxLayout>
  );
};
