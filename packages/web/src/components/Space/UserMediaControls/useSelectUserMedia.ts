import { useCallback, useMemo, useState } from "react";

import { useEnumerateMediaDevices } from "./useEnumerateMediaDevices";
import { AudioInputOption, VideoInputOption } from "./types";
import {
  AUDIO_DISABLED_OPTION,
  VIDEO_DISABLED_OPTION,
  SCREEN_SHARING_OPTION,
} from "./constants";

export const useSelectUserMedia = () => {
  const [audioInputOption, setAudioInputOption] = useState<AudioInputOption>(
    AUDIO_DISABLED_OPTION
  );
  const [videoInputOption, setVideoInputOption] = useState<VideoInputOption>(
    VIDEO_DISABLED_OPTION
  );
  const devices = useEnumerateMediaDevices();
  const allAudioInputOptions: AudioInputOption[] = useMemo(
    () => [
      AUDIO_DISABLED_OPTION,
      ...devices.audioDevices.map((device) => ({
        type: "device" as const,
        device,
      })),
    ],
    [devices.audioDevices]
  );
  const allVideoInputOptions: VideoInputOption[] = useMemo(
    () => [
      VIDEO_DISABLED_OPTION,
      ...devices.videoDevices.map((device) => ({
        type: "device" as const,
        device,
      })),
      SCREEN_SHARING_OPTION,
    ],
    [devices.videoDevices]
  );

  const muteAudio = useCallback(
    () => setAudioInputOption(AUDIO_DISABLED_OPTION),
    []
  );
  const muteVideo = useCallback(
    () => setVideoInputOption(VIDEO_DISABLED_OPTION),
    []
  );
  const shareScreen = useCallback(
    () => setVideoInputOption(SCREEN_SHARING_OPTION),
    []
  );
  const selectAudioDevice = useCallback(
    (deviceId: string) => {
      const device = allAudioInputOptions.find(
        (x) => x.type === "device" && x.device.deviceId === deviceId
      );

      setAudioInputOption(device!);
    },
    [allAudioInputOptions]
  );
  const selectVideoDevice = useCallback(
    (deviceId: string) => {
      const device = allVideoInputOptions.find(
        (x) => x.type === "device" && x.device.deviceId === deviceId
      );

      setVideoInputOption(device!);
    },
    [allVideoInputOptions]
  );

  return {
    audioInputOption,
    allAudioInputOptions,
    muteAudio,
    selectAudioDevice,

    videoInputOption,
    allVideoInputOptions,
    muteVideo,
    shareScreen,
    selectVideoDevice,
  };
};
