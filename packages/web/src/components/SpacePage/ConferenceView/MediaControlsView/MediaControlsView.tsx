import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMicrophone,
  faDesktop,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { useEnumerateMediaDevices } from "../../../../hooks/useEnumerateMediaDevices";
import {
  DropdownButton,
  DropdownMenu,
  DropdownToggle,
  DropdownOptionButton,
} from "../../../ui/MediaControlsView/DropdownButton";
import { CancelButton, MediaControlsLayout, ShareScreenButton } from "./styles";

export interface MediaControlsViewProps {}

export const MediaControlsView: React.FC<MediaControlsViewProps> = () => {
  const devices = useEnumerateMediaDevices();

  return (
    <MediaControlsLayout>
      <DropdownButton>
        <DropdownToggle>
          <FontAwesomeIcon aria-label="Share video" icon={faVideo} />
        </DropdownToggle>

        <DropdownMenu>
          <ul>
            {devices.videoDevices.map((device) => (
              <li key={device.deviceId}>
                <DropdownOptionButton>{device.label}</DropdownOptionButton>
              </li>
            ))}
          </ul>
        </DropdownMenu>
      </DropdownButton>

      <DropdownButton>
        <DropdownToggle aria-label="Share audio">
          <FontAwesomeIcon icon={faMicrophone} />
        </DropdownToggle>

        <DropdownMenu>
          <ul>
            {devices.audioDevices.map((device) => (
              <li key={device.deviceId}>
                <DropdownOptionButton>{device.label}</DropdownOptionButton>
              </li>
            ))}
          </ul>
        </DropdownMenu>
      </DropdownButton>

      <ShareScreenButton aria-label="Share screen">
        <FontAwesomeIcon icon={faDesktop} />
      </ShareScreenButton>

      <div />

      <CancelButton aria-label="Leave the space">
        <FontAwesomeIcon icon={faPhone} />
      </CancelButton>
    </MediaControlsLayout>
  );
};
