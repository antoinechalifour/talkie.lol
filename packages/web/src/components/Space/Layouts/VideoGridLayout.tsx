import React from "react";

import { ConferenceViewModel } from "../viewmodels/ConferenceViewModel";
import { RemotePeer } from "../models/RemotePeer";
import { useRemotePeers } from "../useRemotePeers";
import { useLocalUser } from "../useLocalUser";
import { LocalUserBox } from "./UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "./UserStreamBox/RemotePeerBox";
import { VideoGrid } from "./styles";

export interface VideoGridLayoutProps {
  conference: ConferenceViewModel;
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
