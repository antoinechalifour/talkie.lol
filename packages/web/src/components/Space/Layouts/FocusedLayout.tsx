import React from "react";

import { RemotePeer } from "../models/RemotePeer";
import { Conference } from "../models/Conference";
import { useRemotePeers } from "../useRemotePeers";
import { LocalUserBox } from "./UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "./UserStreamBox/RemotePeerBox";
import { FocusedView, PeerPreviewList } from "./styles";
import { useLocalUser } from "../useLocalUser";

export interface FocusedLayoutProps {
  conference: Conference;
  focusedPeer: RemotePeer;
  onFocusPeer: (remotePeer: RemotePeer) => void;
  onRemoveFocusedPeer: () => void;
}

export const FocusedLayout: React.FC<FocusedLayoutProps> = ({
  conference,
  focusedPeer,
  onFocusPeer,
  onRemoveFocusedPeer,
}) => {
  const localUser = useLocalUser(conference);
  const remotePeers = useRemotePeers(conference);

  return (
    <FocusedView>
      <RemotePeerBox remotePeer={focusedPeer} onSelect={onRemoveFocusedPeer} />

      <PeerPreviewList>
        <li>
          <LocalUserBox
            name={localUser.name()}
            mediaStream={localUser.mediaStream()}
          />
        </li>

        {remotePeers
          .filter((x) => !x.is(focusedPeer))
          .map((peer) => (
            <li key={peer.id()}>
              <RemotePeerBox remotePeer={peer} onSelect={onFocusPeer} />
            </li>
          ))}
      </PeerPreviewList>
    </FocusedView>
  );
};
