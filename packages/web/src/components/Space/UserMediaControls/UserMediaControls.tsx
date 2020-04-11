import React, { useCallback } from "react";

import { ToggleMedia } from "./styles";
import { useCaptureMedia } from "./useCaptureMedia";
import { useSelectUserMedia } from "./useSelectUserMedia";
import { AudioInputSelectOption } from "./AudioInputSelectOption";
import { VideoInputSelectOption } from "./VideoInputSelectOption";

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
          {allAudioInputOptions.map((option) => (
            <AudioInputSelectOption option={option} />
          ))}
        </select>
      </ToggleMedia>

      <ToggleMedia htmlFor="rtc-video">
        <span>Video source</span>

        <select name="rtc-video" id="rtc-video" onChange={onVideoInputChanged}>
          {allVideoInputOptions.map((option) => (
            <VideoInputSelectOption key={option.id} option={option} />
          ))}
        </select>
      </ToggleMedia>
    </>
  );
};
