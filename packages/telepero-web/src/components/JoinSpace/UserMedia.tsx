import React, { useEffect, useReducer, useRef } from "react";

export interface UserMediaProps {
  addUserMedia: (userMedia: MediaStream) => void;
  removeUserMedia: () => void;
}

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

export const UserMedia: React.FC<UserMediaProps> = ({
  addUserMedia,
  removeUserMedia,
}) => {
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

  return (
    <>
      <label htmlFor="rtc-audio">
        <input
          type="checkbox"
          id="rtc-audio"
          checked={state.audio}
          onChange={() => dispatch("toggle-audio")}
        />
        <span>Audio</span>
      </label>

      <label htmlFor="rtc-video">
        <input
          type="checkbox"
          id="rtc-video"
          checked={state.video}
          onChange={() => dispatch("toggle-video")}
        />
        <span>Video</span>
      </label>

      <label htmlFor="rtc-screen">
        <input
          type="checkbox"
          id="rtc-screen"
          checked={state.screen}
          onChange={() => dispatch("toggle-screen")}
        />
        <span>Screen sharing</span>
      </label>
    </>
  );
};
