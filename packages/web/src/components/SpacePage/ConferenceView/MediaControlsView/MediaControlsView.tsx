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
import Tooltip from "@reach/tooltip";

import { useEnumerateMediaDevices } from "../../../../hooks/useEnumerateMediaDevices";
import {
  DropdownButton,
  DropdownMenu,
  DropdownToggle,
} from "../../../ui/DropdownButton";
import {
  CancelButton,
  MediaControlsLayout,
  ShareScreenButton,
  tooltipStyle,
} from "./styles";
import { useMediaControlsView } from "./useMediaControlsView";
import { SpaceQrCode } from "./SpaceQrCode";
import { toast } from "react-toastify";
import { VideoDeviceList } from "./VideoDeviceList";
import { AudioDeviceList } from "./AudioDeviceList";

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
    isScreenSharingSupported,
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
      <Tooltip label="Toggle video (cmd + e)" style={tooltipStyle}>
        <div>
          <DropdownButton>
            <DropdownToggle onClick={toggleVideo}>
              <FontAwesomeIcon
                aria-label="Share video"
                icon={isSharingVideo ? faVideo : faVideoSlash}
              />
            </DropdownToggle>

            <DropdownMenu>
              <VideoDeviceList
                videoDevices={devices.videoDevices}
                shareVideoDevice={shareVideoDevice}
              />
            </DropdownMenu>
          </DropdownButton>
        </div>
      </Tooltip>

      <Tooltip label="Toggle audio (cmd + d)" style={tooltipStyle}>
        <div>
          <DropdownButton>
            <DropdownToggle aria-label="Share audio" onClick={toggleAudio}>
              <FontAwesomeIcon
                icon={isSharingAudio ? faMicrophone : faMicrophoneSlash}
              />
            </DropdownToggle>

            <DropdownMenu>
              <AudioDeviceList
                audioDevices={devices.audioDevices}
                shareAudioDevice={shareAudioDevice}
              />
            </DropdownMenu>
          </DropdownButton>
        </div>
      </Tooltip>

      {isScreenSharingSupported ? (
        <Tooltip label="Share screen" style={tooltipStyle}>
          <div>
            <ShareScreenButton aria-label="Share screen" onClick={toggleScreen}>
              <FontAwesomeIcon icon={faDesktop} />
            </ShareScreenButton>
          </div>
        </Tooltip>
      ) : (
        <div />
      )}

      <div />

      <Tooltip label="Invite friends" style={tooltipStyle}>
        <div>
          <DropdownButton>
            <DropdownToggle onClick={copyToClipBoard}>
              <FontAwesomeIcon icon={faShare} />
            </DropdownToggle>

            <DropdownMenu>
              <SpaceQrCode />
            </DropdownMenu>
          </DropdownButton>
        </div>
      </Tooltip>

      <Tooltip label="Leave space" style={tooltipStyle}>
        <div>
          <CancelButton aria-label="Leave the space" onClick={leaveConference}>
            <FontAwesomeIcon icon={faPhone} />
          </CancelButton>
        </div>
      </Tooltip>
    </MediaControlsLayout>
  );
};
