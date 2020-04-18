import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { HomeLayout } from "../HomeLayout/HomeLayout";
import { SpacePage } from "../SpacePage/SpacePage";
import { Button } from "../ui/Button";
import { useJoinSpace } from "./useJoinSpace";
import { JoinButton, VideoLayout } from "./styles";

export interface JoinSpacePageProps {
  spaceSlug: string;
}

export const JoinSpacePage: React.FC<JoinSpacePageProps> = ({ spaceSlug }) => {
  const { conference, isFetching, login, videoRef } = useJoinSpace({
    slug: spaceSlug,
  });

  if (conference) {
    return (
      <AuthenticatedClient token={conference.localUser().token()}>
        <SpacePage conference={conference} />
      </AuthenticatedClient>
    );
  }

  return (
    <HomeLayout>
      <Helmet>
        <title>{createTitle(`Join space ${spaceSlug}`)}</title>
      </Helmet>

      <VideoLayout>
        <video ref={videoRef} autoPlay muted />

        <JoinButton onClick={login} disabled={isFetching}>
          {isFetching ? "Connecting to space..." : `Join space ${spaceSlug}`}
        </JoinButton>
      </VideoLayout>
    </HomeLayout>
  );
};
