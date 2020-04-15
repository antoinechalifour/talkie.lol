import React from "react";

import { RemotePeer } from "../../../../models/RemotePeer";
import { ConferenceViewModel } from "../../../../viewmodels/ConferenceViewModel";
import { useLocalUser } from "../../../../hooks/useLocalUser";
import { useRemotePeers } from "../../../../hooks/useRemotePeers";
import { RemotePeerBox } from "../UserStreamBox/RemotePeerBox";
import { LocalUserBox } from "../UserStreamBox/LocalUserBox";
import { FocusedView, PeerPreviewList } from "./styles";
import { PeerMediaControls } from "../PeerMediaControls/PeerMediaControls";
import { usePictureInPicture } from "../../../../hooks/usePictureInPicture";

interface PresenterLayoutProps {
  conference: ConferenceViewModel;
  presenterPeer: RemotePeer;
  onPresenterPeerChanged: (remotePeer: RemotePeer) => void;
  onRemovePresenterPeer: () => void;
}

export const PresenterLayout: React.FC<PresenterLayoutProps> = ({
  conference,
  presenterPeer,
  onPresenterPeerChanged,
  onRemovePresenterPeer,
}) => {
  const localUser = useLocalUser(conference);
  const remotePeers = useRemotePeers(conference);
  const pip = usePictureInPicture();

  return (
    <FocusedView>
      <RemotePeerBox remotePeer={presenterPeer}>
        <PeerMediaControls
          isPresenterModeEnabled={true}
          onPresenterModeDisabled={onRemovePresenterPeer}
          onPresenterModeEnabled={() => {}}
          isPinPEnabled={presenterPeer.is(pip.currentPeer)}
          onPInPEnabled={() => pip.setCurrentPeer(presenterPeer)}
          onPInPDisabled={pip.removeCurrentPeer}
        />
      </RemotePeerBox>

      <PeerPreviewList>
        <li>
          <LocalUserBox
            name={localUser.name()}
            mediaStream={localUser.mediaStream()}
          />
        </li>

        {remotePeers
          .filter((x) => !x.is(presenterPeer))
          .map((peer) => (
            <li key={peer.id()}>
              <RemotePeerBox remotePeer={peer}>
                <PeerMediaControls
                  isPresenterModeEnabled={false}
                  onPresenterModeEnabled={() => onPresenterPeerChanged(peer)}
                  onPresenterModeDisabled={onRemovePresenterPeer}
                  isPinPEnabled={peer.is(pip.currentPeer)}
                  onPInPEnabled={() => pip.setCurrentPeer(peer)}
                  onPInPDisabled={pip.removeCurrentPeer}
                />
              </RemotePeerBox>
            </li>
          ))}
      </PeerPreviewList>
    </FocusedView>
  );
};
