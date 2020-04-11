import React, { useCallback } from "react";

import { ToggleMedia } from "./styles";
import { useCaptureMedia } from "./useCaptureMedia";
import { useSelectUserMedia } from "./useSelectUserMedia";
import {
  DEFAULT_AUDIO_OPTION,
  DEFAULT_VIDEO_OPTION,
  SCREEN_SHARING_OPTION,
} from "./constants";

export interface UserMediaControlsProps {
  onUserMediaAdded: (mediaStream: MediaStream) => void;
  onUserMediaRemoved: () => void;
}

export const UserMediaControls: React.FC<UserMediaControlsProps> = ({
  onUserMediaAdded,
  onUserMediaRemoved,
}) => {
  const {
    audioInputOption,
    allAudioInputOptions,
    setAudioInputOption,
    videoInputOption,
    allVideoInputOptions,
    setVideoInputOption,
  } = useSelectUserMedia();

  useCaptureMedia({
    audioInputOption,
    videoInputOption,
    onMediaAdded: onUserMediaAdded,
    onMediaRemoved: onUserMediaRemoved,
  });

  const onAudioInputChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === "off") {
        setAudioInputOption(DEFAULT_AUDIO_OPTION);
        return;
      }

      const device = allAudioInputOptions.find(
        (x) => x.type === "device" && x.device.deviceId === e.target.value
      );

      setAudioInputOption(device!);
    },
    [allAudioInputOptions, setAudioInputOption]
  );

  const onVideoInputChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === "off") {
        setVideoInputOption(DEFAULT_VIDEO_OPTION);
        return;
      } else if (e.target.value === "screen") {
        setVideoInputOption(SCREEN_SHARING_OPTION);
        return;
      }

      const device = allVideoInputOptions.find(
        (x) => x.type === "device" && x.device.deviceId === e.target.value
      );

      setVideoInputOption(device!);
    },
    [allVideoInputOptions, setVideoInputOption]
  );

  return (
    <>
      <ToggleMedia htmlFor="rtc-audio">
        <span>Audio source</span>

        <select name="rtc-audio" id="rtc-audio" onChange={onAudioInputChanged}>
          {allAudioInputOptions.map((inputOption) => {
            if (inputOption.type === "none") {
              return (
                <option key="off" value="off">
                  Mute input
                </option>
              );
            }
            return (
              <option
                key={inputOption.device.deviceId}
                value={inputOption.device.deviceId}
              >
                {inputOption.device.label}
              </option>
            );
          })}
        </select>
      </ToggleMedia>

      <ToggleMedia htmlFor="rtc-video">
        <span>Video source</span>

        <select name="rtc-video" id="rtc-video" onChange={onVideoInputChanged}>
          {allVideoInputOptions.map((inputOption) => {
            if (inputOption.type === "none") {
              return (
                <option key="off" value="off">
                  Do not share video
                </option>
              );
            } else if (inputOption.type === "device") {
              return (
                <option
                  key={inputOption.device.deviceId}
                  value={inputOption.device.deviceId}
                >
                  {inputOption.device.label}
                </option>
              );
            }

            return (
              <option key="screen" value="screen">
                Share your screen
              </option>
            );
          })}
        </select>
      </ToggleMedia>
    </>
  );
};
