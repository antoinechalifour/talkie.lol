import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { Space } from "./Space";
import { Home } from "../Home/Home";
import { Button } from "../ui/Button";
import { useJoinSpace } from "./useJoinSpace";

export interface SpaceViewProps {
  spaceSlug: string;
}

export const JoinSpace: React.FC<SpaceViewProps> = ({ spaceSlug }) => {
  const { conference, isFetching, login } = useJoinSpace({ slug: spaceSlug });

  if (conference) {
    return (
      <AuthenticatedClient token={conference.localUser().token()}>
        <Space conference={conference} />
      </AuthenticatedClient>
    );
  }

  return (
    <Home>
      <Helmet>
        <title>{createTitle(`Join space ${spaceSlug}`)}</title>
      </Helmet>

      {isFetching ? (
        <p>Connecting to space...</p>
      ) : (
        <Button onClick={login}>Join space {spaceSlug}</Button>
      )}
    </Home>
  );
};
