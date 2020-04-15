import React, { useCallback } from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";
import { useConference } from "./webrtc/useConference";
import { useLocalUser } from "../../hooks/useLocalUser";
import { useNotifier } from "./useNotifier";
import { HeaderArea, PageLayout } from "./styles";
import { ConferenceView } from "./ConferenceView/ConferenceView";

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
    <>
      <Helmet>
        <title>{createTitle(conference.name())}</title>
      </Helmet>

      <PageLayout>
        <HeaderArea>WebRTC Experiments</HeaderArea>
        <ConferenceView />
      </PageLayout>
    </>
  );
};
