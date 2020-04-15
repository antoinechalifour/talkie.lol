import { useCallback, useState } from "react";
import { loader } from "graphql.macro";
import { useMutation } from "urql";

import { Conference } from "../../models/Conference";
import { CurrentUser } from "../../models/CurrentUser";
import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";

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
    rtcConfiguration: {
      iceServers: Array<{
        urls: string[];
      }>;
    };
  };
}

interface UseJoinSpaceOptions {
  slug: string;
}

export const useJoinSpace = ({ slug }: UseJoinSpaceOptions) => {
  const [conference, setConference] = useState<ConferenceViewModel | null>(
    null
  );
  const [loginMutationResult, loginMutation] = useMutation<
    LoginResult,
    LoginVariables
  >(LOGIN);

  const login = useCallback(async () => {
    const result = await loginMutation({ slug });

    if (!result.data) return;

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const currentUser = CurrentUser.create(
      result.data.login.session.user.id,
      result.data.login.session.token,
      result.data.login.session.user.name,
      result.data.login.rtcConfiguration,
      mediaStream
    );
    const conference = Conference.create(slug, currentUser);

    setConference(ConferenceViewModel.create(conference));
  }, [loginMutation, slug]);

  return {
    conference,
    isFetching: loginMutationResult.fetching,
    login,
  };
};
