import { useState } from "react";

import { useEnumerateMediaDevices } from "./useEnumerateMediaDevices";
import { AudioInputOption, VideoInputOption } from "./types";
import {
  DEFAULT_AUDIO_OPTION,
  DEFAULT_VIDEO_OPTION,
  SCREEN_SHARING_OPTION,
} from "./constants";

export const useSelectUserMedia = () => {
  const [audioInputOption, setAudioInputOption] = useState<AudioInputOption>(
    DEFAULT_AUDIO_OPTION
  );
  const [videoInputOption, setVideoInputOption] = useState<VideoInputOption>(
    DEFAULT_VIDEO_OPTION
  );

  const devices = useEnumerateMediaDevices();

  return {
    audioInputOption,
    setAudioInputOption,
    allAudioInputOptions: [
      DEFAULT_VIDEO_OPTION,
      ...devices.audioDevices.map((device) => ({
        type: "device",
        device,
      })),
    ] as AudioInputOption[],

    videoInputOption,
    setVideoInputOption,
    allVideoInputOptions: [
      DEFAULT_VIDEO_OPTION,
      ...devices.videoDevices.map((device) => ({
        type: "device",
        device,
      })),
      SCREEN_SHARING_OPTION,
    ] as VideoInputOption[],
  };
};
