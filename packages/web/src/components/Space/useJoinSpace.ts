import { loader } from "graphql.macro";
import { useMutation } from "urql";
import { useCallback } from "react";

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

interface UseJoinSpaceOptions {
  slug: string;
}

export const useJoinSpace = ({ slug }: UseJoinSpaceOptions) => {
  const [loginMutationResult, loginMutation] = useMutation<
    LoginResult,
    LoginVariables
  >(LOGIN);

  const login = useCallback(() => loginMutation({ slug }), [
    loginMutation,
    slug,
  ]);

  return {
    session: loginMutationResult.data?.login.session,
    isFetching: loginMutationResult.fetching,
    login,
  };
};
