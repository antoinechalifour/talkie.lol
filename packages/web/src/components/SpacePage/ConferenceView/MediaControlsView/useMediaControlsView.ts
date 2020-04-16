import { useCallback, useReducer } from "react";
import { useHistory } from "react-router-dom";

import { useConference } from "../../hooks/useConference";

interface State {
  isSharingAudio: boolean;
  isSharingVideo: boolean;
  isSharingScreen: boolean;
}

type Action =
  | "START_AUDIO"
  | "STOP_AUDIO"
  | "START_VIDEO"
  | "STOP_VIDEO"
  | "START_SCREEN"
  | "STOP_SCREEN";

const initialState: State = {
  isSharingAudio: true,
  isSharingVideo: true,
  isSharingScreen: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action) {
    case "START_AUDIO":
      return {
        ...state,
        isSharingAudio: true,
      };

    case "STOP_AUDIO":
      return {
        ...state,
        isSharingAudio: false,
      };

    case "START_VIDEO":
      return {
        ...state,
        isSharingVideo: true,
        isSharingScreen: false,
      };

    case "STOP_VIDEO":
      return {
        ...state,
        isSharingVideo: false,
      };

    case "START_SCREEN":
      return {
        ...state,
        isSharingVideo: false,
        isSharingScreen: true,
      };

    case "STOP_SCREEN":
      return {
        ...state,
        isSharingScreen: false,
      };
  }
};

const getAudioStreamByDeviceId = (deviceId: string) =>
  navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: { exact: deviceId },
    },
  });

const getVideoStreamByDeviceId = (deviceId: string) =>
  navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: { exact: deviceId },
    },
  });

export const useMediaControlsView = () => {
  const history = useHistory();
  const conference = useConference();
  const [state, dispatch] = useReducer(reducer, initialState);

  const startSharingAudio = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    dispatch("START_AUDIO");
    conference.startLocalAudio(mediaStream.getAudioTracks());
  }, [conference]);

  const stopSharingAudio = useCallback(() => {
    dispatch("STOP_AUDIO");
    conference.stopLocalAudio();
  }, [conference]);

  const shareAudioDevice = useCallback(
    async (deviceId: string) => {
      const mediaStream = await getAudioStreamByDeviceId(deviceId);

      dispatch("START_AUDIO");
      conference.startLocalAudio(mediaStream.getAudioTracks());
    },
    [conference]
  );

  const startSharingVideo = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    dispatch("START_VIDEO");
    conference.startLocalVideo(mediaStream.getVideoTracks());
  }, [conference]);

  const stopSharingVideo = useCallback(() => {
    dispatch("STOP_VIDEO");
    conference.stopLocalVideo();
  }, [conference]);

  const shareVideoDevice = useCallback(
    async (deviceId: string) => {
      const mediaStream = await getVideoStreamByDeviceId(deviceId);

      dispatch("START_VIDEO");
      conference.startLocalVideo(mediaStream.getVideoTracks());
    },
    [conference]
  );

  const startSharingScreen = useCallback(async () => {
    // @ts-ignore
    const mediaStream: MediaStream = await navigator.mediaDevices.getDisplayMedia();
    conference.startLocalVideo(mediaStream.getVideoTracks());
  }, [conference]);

  const stopSharingScreen = useCallback(() => {
    dispatch("STOP_SCREEN");
    conference.stopLocalVideo();
  }, [conference]);

  const leaveConference = useCallback(() => {
    conference.leave();
    history.replace("/");
  }, [conference, history]);

  return {
    ...state,
    startSharingAudio,
    startSharingVideo,
    stopSharingAudio,
    stopSharingVideo,
    shareAudioDevice,
    shareVideoDevice,
    startSharingScreen,
    stopSharingScreen,
    leaveConference,
  };
};
