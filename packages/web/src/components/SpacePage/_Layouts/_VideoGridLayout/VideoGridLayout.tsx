import React from "react";

import { ConferenceViewModel } from "../../../../viewmodels/ConferenceViewModel";
import { RemotePeer } from "../../../../models/RemotePeer";
import { useRemotePeers } from "../../hooks/useRemotePeers";
import { useLocalUser } from "../../hooks/useLocalUser";
import { LocalUserBox } from "../UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "../UserStreamBox/RemotePeerBox";
import { VideoGrid } from "./styles";
import { PeerMediaControls } from "../PeerMediaControls/PeerMediaControls";
import { usePictureInPicture } from "../../../../hooks/usePictureInPicture";

export interface VideoGridLayoutProps {
  conference: ConferenceViewModel;
  onPresenterPeerSelected: (peer: RemotePeer) => void;
}

export const VideoGridLayout: React.FC<VideoGridLayoutProps> = ({
  conference,
  onPresenterPeerSelected,
}) => {
  const localUser = useLocalUser(conference);
  const remotePeers = useRemotePeers(conference);
  const pip = usePictureInPicture();

  return (
    <VideoGrid>
      <LocalUserBox
        name={localUser.name()}
        mediaStream={localUser.mediaStream()}
      />

      {remotePeers.map((remotePeer) => (
        <RemotePeerBox key={remotePeer.id()} remotePeer={remotePeer}>
          <PeerMediaControls
            isPresenterModeEnabled={false}
            onPresenterModeEnabled={() => onPresenterPeerSelected(remotePeer)}
            onPresenterModeDisabled={() => {}}
            isPinPEnabled={remotePeer.is(pip.currentPeer)}
            onPInPEnabled={() => pip.setCurrentPeer(remotePeer)}
            onPInPDisabled={pip.removeCurrentPeer}
          />
        </RemotePeerBox>
      ))}
    </VideoGrid>
  );
};
