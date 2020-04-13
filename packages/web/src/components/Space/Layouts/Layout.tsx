import React from "react";

import { Conference } from "../models/Conference";
import { useLayoutManager } from "./useLayoutManager";
import { FocusedLayout } from "./FocusedLayout";
import { VideoGridLayout } from "./VideoGridLayout";

export interface LayoutProps {
  conference: Conference;
}

export const Layout: React.FC<LayoutProps> = ({ conference }) => {
  const { focusedPeer, setFocusedPeer, removeFocusedPeer } = useLayoutManager();

  if (focusedPeer) {
    return (
      <FocusedLayout
        conference={conference}
        focusedPeer={focusedPeer}
        onFocusPeer={setFocusedPeer}
        onRemoveFocusedPeer={removeFocusedPeer}
      />
    );
  }

  return (
    <VideoGridLayout conference={conference} onFocusPeer={setFocusedPeer} />
  );
};
