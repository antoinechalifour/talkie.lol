import React from "react";

import { RemotePeer } from "../RemotePeer";
import { LocalUserBox } from "./UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "./UserStreamBox/RemotePeerBox";
import { VideoGrid } from "./styles";

export interface VideoGridLayoutProps {
  localUser: {
    name: string;
    mediaStream: MediaStream | null;
  };
  remotePeers: RemotePeer[];
  onFocusPeer: (peer: RemotePeer) => void;
}

export const VideoGridLayout: React.FC<VideoGridLayoutProps> = ({
  localUser,
  remotePeers,
  onFocusPeer,
}) => (
  <VideoGrid>
    <LocalUserBox name={localUser.name} mediaStream={localUser.mediaStream} />

    {remotePeers.map((remotePeer) => (
      <RemotePeerBox
        key={remotePeer.id()}
        remotePeer={remotePeer}
        onSelect={onFocusPeer}
      />
    ))}
  </VideoGrid>
);
