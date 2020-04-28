import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";
import { ConferenceView } from "./ConferenceView/ConferenceView";
import { Header } from "./Header/Header";
import { useSignaling } from "./webrtc/useSignaling";
import { useNotifier } from "./useNotifier";
import { conferenceContext } from "./context";
import { PageLayout } from "./styles";

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
        <Header>Talkie.LOL</Header>
        <ConferenceView />
      </PageLayout>
    </conferenceContext.Provider>
  );
};
