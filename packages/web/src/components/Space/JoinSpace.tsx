import React, { useCallback } from "react";
import { loader } from "graphql.macro";
import { useMutation } from "urql";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { Space } from "./Space";
import { Home } from "../Home/Home";
import { Button } from "../ui/Button";

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
        name: string;
      };
    };
  };
}

export interface SpaceViewProps {
  spaceSlug: string;
}

export const JoinSpace: React.FC<SpaceViewProps> = ({ spaceSlug }) => {
  const [loginMutationResult, loginMutation] = useMutation<
    LoginResult,
    LoginVariables
  >(LOGIN);

  const login = useCallback(() => loginMutation({ slug: spaceSlug }), [
    loginMutation,
    spaceSlug,
  ]);

  if (loginMutationResult.data) {
    return (
      <AuthenticatedClient token={loginMutationResult.data.login.session.token}>
        <Space
          userName={loginMutationResult.data.login.session.user.name}
          slug={spaceSlug}
        />
      </AuthenticatedClient>
    );
  }

  return (
    <Home>
      {loginMutationResult.fetching ? (
        <p>Connecting to space...</p>
      ) : (
        <Button onClick={login}>Join space {spaceSlug}</Button>
      )}
    </Home>
  );
};
