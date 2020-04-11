import { useEffect, useRef } from "react";

import { logMedia } from "../webrtc/log";
import { AudioInputOption, VideoInputOption } from "./types";

interface UseCaptureMediaOptions {
  audioInputOption: AudioInputOption;
  videoInputOption: VideoInputOption;
  onMediaAdded: (mediaStream: MediaStream) => void;
  onMediaRemoved: () => void;
}

export const useCaptureMedia = ({
  audioInputOption,
  videoInputOption,
  onMediaAdded,
  onMediaRemoved,
}: UseCaptureMediaOptions) => {
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (audioInputOption.type === "none" && videoInputOption.type === "none") {
      return;
    }

    let promise: Promise<MediaStream>;

    if (videoInputOption.type === "screen") {
      // @ts-ignore
      promise = navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });
    } else {
      const audioConstraints: MediaStreamConstraints["audio"] =
        audioInputOption.type === "none"
          ? false
          : {
              deviceId: { exact: audioInputOption.device.deviceId },
            };

      const videoConstraints: MediaStreamConstraints["video"] =
        videoInputOption.type === "none"
          ? false
          : {
              deviceId: { exact: videoInputOption.device.deviceId },
            };

      promise = navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: videoConstraints,
      });
    }

    promise.then((mediaStream) => {
      mediaStreamRef.current = mediaStream;
      logMedia("Adding local screen media !");
      onMediaAdded(mediaStream);
    });

    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      onMediaRemoved();
    };
  }, [audioInputOption, videoInputOption, onMediaAdded, onMediaRemoved]);
};
