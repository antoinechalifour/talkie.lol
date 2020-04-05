import React, { useEffect } from "react";
import { loader } from "graphql.macro";
import { useMutation } from "urql";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { Space } from "./Space";

const LOGIN = loader("./Login.graphql");

interface LoginVariables {
  slug: string;
}

interface LoginResult {
  login: {
    session: {
      token: string;
    user: {
      id: string;
    };
    };
  };
}

export interface SpaceViewProps {
  spaceSlug: string;
}

export const JoinSpaceView: React.FC<SpaceViewProps> = ({ spaceSlug }) => {
  const [loginResult, login] = useMutation<LoginResult, LoginVariables>(LOGIN);

  useEffect(() => {
    login({ slug: spaceSlug });
  }, [login, spaceSlug]);

  if (loginResult.data) {
    return (
      <AuthenticatedClient token={loginResult.data.login.session.token}>
        <Space userId={loginResult.data.login.session.user.id} slug={spaceSlug} />
      </AuthenticatedClient>
    );
  }

  return <p>Connecting to space...</p>;
};
