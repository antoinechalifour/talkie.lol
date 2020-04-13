import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { HomeLayout } from "../HomeLayout/HomeLayout";
import { SpacePage } from "../SpacePage/SpacePage";
import { Button } from "../ui/Button";
import { useJoinSpace } from "./useJoinSpace";

export interface JoinSpacePageProps {
  spaceSlug: string;
}

export const JoinSpacePage: React.FC<JoinSpacePageProps> = ({ spaceSlug }) => {
  const { conference, isFetching, login } = useJoinSpace({ slug: spaceSlug });

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

      {isFetching ? (
        <p>Connecting to space...</p>
      ) : (
        <Button onClick={login}>Join space {spaceSlug}</Button>
      )}
    </HomeLayout>
  );
};
