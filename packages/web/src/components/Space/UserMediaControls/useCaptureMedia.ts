import { useEffect, useRef } from "react";

import { AudioInputOption, VideoInputOption } from "./types";

interface UseCaptureMediaOptions {
  audioInputOption: AudioInputOption;
  videoInputOption: VideoInputOption;
  onMediaAdded: (mediaStream: MediaStream) => void;
  onMediaRemoved: () => void;
}

const getAudioConstraintFromOption = (
  option: AudioInputOption
): MediaStreamConstraints["audio"] =>
  option.type === "none"
    ? false
    : {
        deviceId: { exact: option.device.deviceId },
      };

const getVideoConstaintFromOption = (
  option: VideoInputOption
): MediaStreamConstraints["video"] =>
  option.type === "device"
    ? {
        deviceId: { exact: option.device.deviceId },
      }
    : false;

const getDisplayMediaStream = (
  audioInputOption: AudioInputOption
): Promise<MediaStream> =>
  // @ts-ignore
  navigator.mediaDevices.getDisplayMedia({
    audio: audioInputOption.type === "device",
    video: true,
  });

const getUserMediaStream = (
  audioInputOption: AudioInputOption,
  videoInputOption: VideoInputOption
) =>
  navigator.mediaDevices.getUserMedia({
    audio: getAudioConstraintFromOption(audioInputOption),
    video: getVideoConstaintFromOption(videoInputOption),
  });

export const useCaptureMedia = ({
  audioInputOption,
  videoInputOption,
  onMediaAdded,
  onMediaRemoved,
}: UseCaptureMediaOptions) => {
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (audioInputOption.type === "none" && videoInputOption.type === "none")
      return;

    const promise =
      videoInputOption.type === "screen"
        ? getDisplayMediaStream(audioInputOption)
        : getUserMediaStream(audioInputOption, videoInputOption);

    promise.then((mediaStream) => {
      mediaStreamRef.current = mediaStream;
      onMediaAdded(mediaStream);
    });

    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      onMediaRemoved();
    };
  }, [audioInputOption, videoInputOption, onMediaAdded, onMediaRemoved]);
};
