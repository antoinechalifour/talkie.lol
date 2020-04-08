import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

import { useCaptureMedia } from "./useCaptureMedia";
import { ToggleMedia } from "./styles";

export interface UserMediaControlsProps {
  onUserMediaAdded: (mediaStream: MediaStream) => void;
  onUserMediaRemoved: () => void;
}

export const UserMediaControls: React.FC<UserMediaControlsProps> = ({
  onUserMediaAdded,
  onUserMediaRemoved,
}) => {
  const {
    isSharingAudio,
    toggleAudio,
    isSharingVideo,
    toggleVideo,
    isSharingScreen,
    toggleScreen,
  } = useCaptureMedia({
    onMediaAdded: onUserMediaAdded,
    onMediaRemoved: onUserMediaRemoved,
  });

  return (
    <>
      <ToggleMedia htmlFor="rtc-audio">
        <input
          type="checkbox"
          id="rtc-audio"
          checked={isSharingAudio}
          onChange={toggleAudio}
        />

        <span>
          <FontAwesomeIcon icon={faMicrophone} />
        </span>
      </ToggleMedia>

      <ToggleMedia htmlFor="rtc-video">
        <input
          type="checkbox"
          id="rtc-video"
          checked={isSharingVideo}
          onChange={toggleVideo}
        />

        <span>
          <FontAwesomeIcon icon={faVideo} />
        </span>
      </ToggleMedia>

      <ToggleMedia htmlFor="rtc-screen">
        <input
          type="checkbox"
          id="rtc-screen"
          checked={isSharingScreen}
          onChange={toggleScreen}
        />

        <span>
          <FontAwesomeIcon icon={faExternalLinkAlt} />
        </span>
      </ToggleMedia>
    </>
  );
};
