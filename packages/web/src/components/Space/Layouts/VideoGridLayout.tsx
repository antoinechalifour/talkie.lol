import React from "react";

import { RemotePeer } from "../models/RemotePeer";
import { Conference } from "../models/Conference";
import { useRemotePeers } from "../useRemotePeers";
import { LocalUserBox } from "./UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "./UserStreamBox/RemotePeerBox";
import { VideoGrid } from "./styles";
import { useLocalUser } from "../useLocalUser";

export interface VideoGridLayoutProps {
  conference: Conference;
  onFocusPeer: (peer: RemotePeer) => void;
}

export const VideoGridLayout: React.FC<VideoGridLayoutProps> = ({
  conference,
  onFocusPeer,
}) => {
  const localUser = useLocalUser(conference);
  const remotePeers = useRemotePeers(conference);

  return (
    <VideoGrid>
      <LocalUserBox
        name={localUser.name()}
        mediaStream={localUser.mediaStream()}
      />

      {remotePeers.map((remotePeer) => (
        <RemotePeerBox
          key={remotePeer.id()}
          remotePeer={remotePeer}
          onSelect={onFocusPeer}
        />
      ))}
    </VideoGrid>
  );
};
