import React from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { createTitle } from "../../utils/html";
import {
  ControlsLayout,
  HeaderLayout,
  SpaceLayout,
  MainContent,
} from "./styles";
import { UserMediaControls } from "./UserMediaControls/UserMediaControls";
import { useRtc } from "./webrtc/useRtc";
import { SpaceQrCode } from "./SpaceQrCode";
import { useNotifier } from "./useNotifier";
import { Layout } from "./Layouts/Layout";
import { usePictureInPicture } from "./usePictureInPicture";

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
  usePictureInPicture({ remotePeers });

  return (
    <SpaceLayout>
      <Helmet>
        <title>{createTitle(slug)}</title>
      </Helmet>

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
        <Layout
          remotePeers={remotePeers}
          localUser={{ name: userName, mediaStream: localStream }}
        />

        <SpaceQrCode />

        <ControlsLayout>
          <UserMediaControls
            onUserMediaAdded={addLocalStream}
            onUserMediaRemoved={removeLocalStream}
          />
        </ControlsLayout>
      </MainContent>
    </SpaceLayout>
  );
};
