import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
  faDesktop,
  faPhone,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

import { useEnumerateMediaDevices } from "../../../../hooks/useEnumerateMediaDevices";
import {
  DropdownButton,
  DropdownMenu,
  DropdownToggle,
  DropdownOptionButton,
} from "../../../ui/DropdownButton";
import { CancelButton, MediaControlsLayout, ShareScreenButton } from "./styles";
import { useMediaControlsView } from "./useMediaControlsView";
import { SpaceQrCode } from "./SpaceQrCode";
import { toast } from "react-toastify";

export interface MediaControlsViewProps {}

export const MediaControlsView: React.FC<MediaControlsViewProps> = () => {
  const devices = useEnumerateMediaDevices();
  const {
    isSharingAudio,
    startSharingAudio,
    stopSharingAudio,
    shareAudioDevice,

    isSharingVideo,
    startSharingVideo,
    stopSharingVideo,
    shareVideoDevice,

    isSharingScreen,
    startSharingScreen,
    stopSharingScreen,

    leaveConference,
  } = useMediaControlsView();

  const toggleAudio = useCallback(() => {
    if (isSharingAudio) stopSharingAudio();
    else startSharingAudio();
  }, [isSharingAudio, startSharingAudio, stopSharingAudio]);

  const toggleVideo = useCallback(() => {
    if (isSharingVideo) stopSharingVideo();
    else startSharingVideo();
  }, [isSharingVideo, startSharingVideo, stopSharingVideo]);

  const toggleScreen = useCallback(() => {
    if (isSharingScreen) stopSharingScreen();
    else startSharingScreen();
  }, [isSharingScreen, startSharingScreen, stopSharingScreen]);

  const copyToClipBoard = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);

    toast.success("The link has been copied to clipboard");
  }, []);

  return (
    <MediaControlsLayout>
      <DropdownButton>
        <DropdownToggle onClick={toggleVideo}>
          <FontAwesomeIcon
            aria-label="Share video"
            icon={isSharingVideo ? faVideoSlash : faVideo}
          />
        </DropdownToggle>

        <DropdownMenu>
          <ul>
            {devices.videoDevices.map((device) => (
              <li key={device.deviceId}>
                <DropdownOptionButton
                  onClick={() => shareVideoDevice(device.deviceId)}
                >
                  {device.label}
                </DropdownOptionButton>
              </li>
            ))}
          </ul>
        </DropdownMenu>
      </DropdownButton>

      <DropdownButton>
        <DropdownToggle aria-label="Share audio" onClick={toggleAudio}>
          <FontAwesomeIcon
            icon={isSharingAudio ? faMicrophoneSlash : faMicrophone}
          />
        </DropdownToggle>

        <DropdownMenu>
          <ul>
            {devices.audioDevices.map((device) => (
              <li key={device.deviceId}>
                <DropdownOptionButton
                  onClick={() => shareAudioDevice(device.deviceId)}
                >
                  {device.label}
                </DropdownOptionButton>
              </li>
            ))}
          </ul>
        </DropdownMenu>
      </DropdownButton>

      <ShareScreenButton aria-label="Share screen" onClick={toggleScreen}>
        <FontAwesomeIcon icon={faDesktop} />
      </ShareScreenButton>

      <div />

      <DropdownButton>
        <DropdownToggle onClick={copyToClipBoard}>
          <FontAwesomeIcon icon={faShare} />
        </DropdownToggle>

        <DropdownMenu>
          <SpaceQrCode />
        </DropdownMenu>
      </DropdownButton>

      <CancelButton aria-label="Leave the space" onClick={leaveConference}>
        <FontAwesomeIcon icon={faPhone} />
      </CancelButton>
    </MediaControlsLayout>
  );
};
