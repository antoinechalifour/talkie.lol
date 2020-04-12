import React, { useCallback } from "react";
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
import { SpaceQrCode } from "./SpaceQrCode";
import { useNotifier } from "./useNotifier";
import { Layout } from "./Layouts/Layout";
import { Conference } from "./models/Conference";
import { useConference } from "./webrtc/useConference";
import { useLocalUser } from "./useLocalUser";

export interface SpaceProps {
  conference: Conference;
}

export const Space: React.FC<SpaceProps> = ({ conference }) => {
  const localUser = useLocalUser(conference);

  useConference(conference);
  useNotifier(conference);

  const onUserMediaAdded = useCallback(
    (mediaStream: MediaStream) =>
      conference.addLocalUserMediaStream(mediaStream),
    [conference]
  );
  const onUserMediaRemoved = useCallback(
    () => conference.removeLocalUserMediaStream(),
    [conference]
  );

  return (
    <SpaceLayout>
      <Helmet>
        <title>{createTitle(conference.name())}</title>
      </Helmet>

      <HeaderLayout>
        <h1>
          WebRTC Experiments
          <span> / {conference.name()}</span>
        </h1>
        <p>
          <FontAwesomeIcon icon={faUser} /> {localUser.name()}
        </p>
      </HeaderLayout>

      <MainContent>
        <Layout conference={conference} />

        <SpaceQrCode />

        <ControlsLayout>
          <UserMediaControls
            onUserMediaAdded={onUserMediaAdded}
            onUserMediaRemoved={onUserMediaRemoved}
          />
        </ControlsLayout>
      </MainContent>
    </SpaceLayout>
  );
};
