import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import {
  ControlsLayout,
  HeaderLayout,
  SpaceLayout,
  MainContent,
  VideoGrid,
} from "./styles";
import { UserMediaControls } from "./UserMediaControls/UserMediaControls";
import { useRtc } from "./webrtc/useRtc";
import { LocalUserBox } from "./UserStreamBox/LocalUserBox";
import { RemotePeerBox } from "./UserStreamBox/RemotePeerBox";
import { SpaceQrCode } from "./SpaceQrCode";
import { useNotifier } from "./useNotifier";

export interface SpaceProps {
  userName: string;
  slug: string;
}

export const Space: React.FC<SpaceProps> = ({ userName, slug }) => {
  const {
    remotePeers,
    localStream,
    addLocalStream,
    removeLocalStream,
  } = useRtc(slug);

  useNotifier({ remotePeers });

  return (
    <SpaceLayout>
      <HeaderLayout>
        <h1>
          WebRTC Experiments
          <span> / {slug}</span>
        </h1>
        <p>
          <FontAwesomeIcon icon={faUser} /> {userName}
        </p>
      </HeaderLayout>

      <MainContent>
        <VideoGrid>
          <LocalUserBox name={userName} mediaStream={localStream} />

          {remotePeers.map((remotePeer) => (
            <RemotePeerBox key={remotePeer.id()} remotePeer={remotePeer} />
          ))}
        </VideoGrid>

        <SpaceQrCode />
      </MainContent>

      <ControlsLayout>
        <UserMediaControls
          onUserMediaAdded={addLocalStream}
          onUserMediaRemoved={removeLocalStream}
        />
      </ControlsLayout>
    </SpaceLayout>
  );
};
