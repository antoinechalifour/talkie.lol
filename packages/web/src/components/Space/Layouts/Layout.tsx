import React from "react";

import { RemotePeer } from "../RemotePeer";
import { useLayoutManager } from "./useLayoutManager";
import { FocusedLayout } from "./FocusedLayout";
import { VideoGridLayout } from "./VideoGridLayout";

export interface LayoutProps {
  remotePeers: RemotePeer[];
  localUser: {
    name: string;
    mediaStream: MediaStream | null;
  };
}

export const Layout: React.FC<LayoutProps> = ({ remotePeers, localUser }) => {
  const { focusedPeer, setFocusedPeer, removeFocusedPeer } = useLayoutManager();

  if (focusedPeer) {
    return (
      <FocusedLayout
        focusedPeer={focusedPeer}
        localUser={localUser}
        onFocusPeer={setFocusedPeer}
        onRemoveFocusedPeer={removeFocusedPeer}
        otherPeers={remotePeers.filter((x) => !x.is(focusedPeer))}
      />
    );
  }

  return (
    <VideoGridLayout
      localUser={localUser}
      remotePeers={remotePeers}
      onFocusPeer={setFocusedPeer}
    />
  );
};
