import React, { useState } from "react";

import { RemotePeer } from "../RemotePeer";
import { LocalUserBox } from "./UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "./UserStreamBox/RemotePeerBox";
import { FocusedLayout, PeerPreviewList, VideoGrid } from "./styles";

export interface LayoutProps {
  remotePeers: RemotePeer[];
  localUser: {
    name: string;
    mediaStream: MediaStream | null;
  };
}

export const Layout: React.FC<LayoutProps> = ({ remotePeers, localUser }) => {
  const [focusedPeer, setFocusedPeer] = useState<RemotePeer | null>(null);

  if (focusedPeer) {
    return (
      <FocusedLayout>
        <RemotePeerBox
          remotePeer={focusedPeer}
          onSelect={() => setFocusedPeer(null)}
        />

        <PeerPreviewList>
          <li>
            <LocalUserBox
              name={localUser.name}
              mediaStream={localUser.mediaStream}
            />
          </li>

          {remotePeers
            .filter((x) => !x.is(focusedPeer))
            .map((peer) => (
              <li key={peer.id()}>
                <RemotePeerBox remotePeer={peer} onSelect={setFocusedPeer} />
              </li>
            ))}
        </PeerPreviewList>
      </FocusedLayout>
    );
  }

  return (
    <VideoGrid>
      <LocalUserBox name={localUser.name} mediaStream={localUser.mediaStream} />

      {remotePeers.map((remotePeer) => (
        <RemotePeerBox
          key={remotePeer.id()}
          remotePeer={remotePeer}
          onSelect={setFocusedPeer}
        />
      ))}
    </VideoGrid>
  );
};
