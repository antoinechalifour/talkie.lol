import React from "react";

import { ConferenceViewModel } from "../../../viewmodels/ConferenceViewModel";
import { useLayoutManager } from "./useLayoutManager";
import { VideoGridLayout } from "./VideoGridLayout/VideoGridLayout";
import { PresenterLayout } from "./PresenterLayout/PresenterLayout";

export interface LayoutProps {
  conference: ConferenceViewModel;
}

export const Layout: React.FC<LayoutProps> = ({ conference }) => {
  const {
    presenterPeer,
    setPresenterPeer,
    removePresenterPeer,
  } = useLayoutManager();

  if (presenterPeer) {
    return (
      <PresenterLayout
        conference={conference}
        presenterPeer={presenterPeer}
        onPresenterPeerChanged={setPresenterPeer}
        onRemovePresenterPeer={removePresenterPeer}
      />
    );
  }

  return (
    <VideoGridLayout
      conference={conference}
      onPresenterPeerSelected={setPresenterPeer}
    />
  );
};
