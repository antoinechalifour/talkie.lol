import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMicrophone,
  faDesktop,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import {
  CancelButton,
  MediaControlsButton,
  MediaControlsLayout,
} from "./styles";

export interface MediaControlsViewProps {}

export const MediaControlsView: React.FC<MediaControlsViewProps> = () => (
  <MediaControlsLayout>
    <MediaControlsButton aria-label="Share video">
      <FontAwesomeIcon icon={faVideo} />
    </MediaControlsButton>

    <MediaControlsButton aria-label="Share audio">
      <FontAwesomeIcon icon={faMicrophone} />
    </MediaControlsButton>

    <MediaControlsButton aria-label="Share screen">
      <FontAwesomeIcon icon={faDesktop} />
    </MediaControlsButton>

    <CancelButton aria-label="Leave the space">
      <FontAwesomeIcon icon={faPhone} />
    </CancelButton>
  </MediaControlsLayout>
);
