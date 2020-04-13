import React, { useCallback } from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { createTitle } from "../../utils/html";
import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";
import { useConference } from "./webrtc/useConference";
import { useLocalUser } from "../../hooks/useLocalUser";
import { useNotifier } from "./useNotifier";
import { UserMediaControls } from "./UserMediaControls/UserMediaControls";
import { Layout } from "./Layouts/Layout";
import { SpaceQrCode } from "./SpaceQrCode";
import {
  ControlsLayout,
  HeaderLayout,
  SpaceLayout,
  MainContent,
} from "./styles";

export interface SpacePageProps {
  conference: ConferenceViewModel;
}

export const SpacePage: React.FC<SpacePageProps> = ({ conference }) => {
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
      </MainContent>

      <ControlsLayout>
        <UserMediaControls
          onUserMediaAdded={onUserMediaAdded}
          onUserMediaRemoved={onUserMediaRemoved}
        />
      </ControlsLayout>
    </SpaceLayout>
  );
};
