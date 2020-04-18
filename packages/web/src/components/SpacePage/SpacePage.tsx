import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";
import { useSignaling } from "./webrtc/useSignaling";
import { useNotifier } from "./useNotifier";
import { ConferenceView } from "./ConferenceView/ConferenceView";
import { conferenceContext } from "./context";
import { HeaderArea, PageLayout } from "./styles";

export interface SpacePageProps {
  conference: ConferenceViewModel;
}

export const SpacePage: React.FC<SpacePageProps> = ({ conference }) => {
  useSignaling(conference);
  useNotifier(conference);

  return (
    <conferenceContext.Provider value={conference}>
      <Helmet>
        <title>{createTitle(conference.name())}</title>
      </Helmet>

      <PageLayout>
        <HeaderArea>Talkie.LOL</HeaderArea>
        <ConferenceView />
      </PageLayout>
    </conferenceContext.Provider>
  );
};
