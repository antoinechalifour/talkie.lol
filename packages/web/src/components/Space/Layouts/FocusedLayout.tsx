import React from "react";

import { LocalUserBox } from "./UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "./UserStreamBox/RemotePeerBox";
import { RemotePeer } from "../RemotePeer";
import { FocusedView, PeerPreviewList } from "./styles";

export interface FocusedLayoutProps {
  focusedPeer: RemotePeer;
  localUser: {
    name: string;
    mediaStream: MediaStream | null;
  };
  otherPeers: RemotePeer[];
  onFocusPeer: (remotePeer: RemotePeer) => void;
  onRemoveFocusedPeer: () => void;
}

export const FocusedLayout: React.FC<FocusedLayoutProps> = ({
  focusedPeer,
  otherPeers,
  localUser,
  onFocusPeer,
  onRemoveFocusedPeer,
}) => (
  <FocusedView>
    <RemotePeerBox remotePeer={focusedPeer} onSelect={onRemoveFocusedPeer} />

    <PeerPreviewList>
      <li>
        <LocalUserBox
          name={localUser.name}
          mediaStream={localUser.mediaStream}
        />
      </li>

      {otherPeers.map((peer) => (
        <li key={peer.id()}>
          <RemotePeerBox remotePeer={peer} onSelect={onFocusPeer} />
        </li>
      ))}
    </PeerPreviewList>
  </FocusedView>
);
