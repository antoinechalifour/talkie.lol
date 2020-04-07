import { useCallback, useEffect, useReducer, useRef } from "react";

interface ConstraintState {
  audio: boolean;
  video: boolean;
  screen: boolean;
}

type ConstraintAction = "toggle-audio" | "toggle-video" | "toggle-screen";

const contraintsReducer = (
  state: ConstraintState,
  action: ConstraintAction
): ConstraintState => {
  switch (action) {
    case "toggle-audio":
      return {
        ...state,
        audio: !state.audio,
      };
    case "toggle-video":
      return {
        ...state,
        video: !state.video,
        screen: false,
      };
    case "toggle-screen":
      return {
        ...state,
        video: false,
        screen: !state.screen,
      };
  }
};

interface UseMediaOptions {
  addUserMedia: (userMedia: MediaStream) => void;
  removeUserMedia: () => void;
}

export const useMedia = ({
  addUserMedia,
  removeUserMedia,
}: UseMediaOptions) => {
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [state, dispatch] = useReducer(contraintsReducer, {
    audio: false,
    video: false,
    screen: false,
  });

  useEffect(() => {
    if (state.screen && "getDisplayMedia" in navigator.mediaDevices) {
      // @ts-ignore
      navigator.mediaDevices.getDisplayMedia().then((mediaStream) => {
        mediaStreamRef.current = mediaStream;
        addUserMedia(mediaStream);
      });
    } else if (state.audio || state.video) {
      const constraints = {
        audio: state.audio,
        video: state.video ? { width: 1280, height: 720 } : false,
      };

      navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
        mediaStreamRef.current = mediaStream;
        addUserMedia(mediaStream);
      });
    }

    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      removeUserMedia();
    };
  }, [state, addUserMedia, removeUserMedia]);

  const toggleAudio = useCallback(() => {
    dispatch("toggle-audio");
  }, [dispatch]);
  const toggleVideo = useCallback(() => {
    dispatch("toggle-video");
  }, [dispatch]);
  const toggleScreen = useCallback(() => {
    dispatch("toggle-screen");
  }, [dispatch]);

  return {
    isSharingAudio: state.audio,
    isSharingVideo: state.video,
    isSharingScreen: state.screen,
    toggleAudio,
    toggleVideo,
    toggleScreen,
  };
};
