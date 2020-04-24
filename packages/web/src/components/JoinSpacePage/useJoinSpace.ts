import { useCallback, useEffect, useRef, useState } from "react";
import { loader } from "graphql.macro";
import { useMutation } from "urql";

import { Conference } from "../../models/Conference";
import { CurrentUser } from "../../models/CurrentUser";
import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";

const LOGIN = loader("./Login.graphql");

interface LoginVariables {
  slug: string;
  userName: string | null;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userName, setUserName] = useState("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [conference, setConference] = useState<ConferenceViewModel | null>(
    null
  );
  const [loginMutationResult, loginMutation] = useMutation<
    LoginResult,
    LoginVariables
  >(LOGIN);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(setMediaStream);
  }, []);

  useEffect(() => {
    return () => {
      if (!mediaStream) return;

      mediaStream.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    if (!mediaStream) return;
    if (!videoRef.current) return;

    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  const login = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!mediaStream) return;

      const result = await loginMutation({ slug, userName: userName || null });

      if (!result.data) return;

      const currentUser = CurrentUser.create(
        result.data.login.session.user.id,
        result.data.login.session.token,
        result.data.login.session.user.name,
        result.data.login.rtcConfiguration,
        mediaStream
      );
      const conference = Conference.create(slug, currentUser);

      setConference(ConferenceViewModel.create(conference));
    },
    [loginMutation, slug, userName, mediaStream]
  );

  return {
    videoRef,
    conference,
    userName,
    setUserName,
    isFetching: loginMutationResult.fetching,
    login,
  };
};
