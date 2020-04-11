import React, { useCallback } from "react";

import { ToggleMedia } from "./styles";
import { useCaptureMedia } from "./useCaptureMedia";
import { useSelectUserMedia } from "./useSelectUserMedia";

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
    muteAudio,
    selectAudioDevice,
    videoInputOption,
    allVideoInputOptions,
    muteVideo,
    shareScreen,
    selectVideoDevice,
  } = useSelectUserMedia();

  useCaptureMedia({
    audioInputOption,
    videoInputOption,
    onMediaAdded: onUserMediaAdded,
    onMediaRemoved: onUserMediaRemoved,
  });

  const onAudioInputChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === "off") muteAudio();
      else selectAudioDevice(e.target.value);
    },
    [muteAudio, selectAudioDevice]
  );

  const onVideoInputChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === "off") muteVideo();
      else if (e.target.value === "screen") shareScreen();
      else selectVideoDevice(e.target.value);
    },
    [muteVideo, selectVideoDevice, shareScreen]
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
