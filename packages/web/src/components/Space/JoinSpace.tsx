import React from "react";

import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { Space } from "./Space";
import { Home } from "../Home/Home";
import { Button } from "../ui/Button";
import { useJoinSpace } from "./useJoinSpace";

export interface SpaceViewProps {
  spaceSlug: string;
}

export const JoinSpace: React.FC<SpaceViewProps> = ({ spaceSlug }) => {
  const { session, isFetching, login } = useJoinSpace({ slug: spaceSlug });

  if (session) {
    return (
      <AuthenticatedClient token={session.token}>
        <Space userName={session.user.name} slug={spaceSlug} />
      </AuthenticatedClient>
    );
  }

  return (
    <Home>
      {isFetching ? (
        <p>Connecting to space...</p>
      ) : (
        <Button onClick={login}>Join space {spaceSlug}</Button>
      )}
    </Home>
  );
};
