import { useEffect, useState } from "react";
import { logMedia } from "../webrtc/log";

interface Devices {
  audio: MediaDeviceInfo[];
  video: MediaDeviceInfo[];
}

export const useEnumerateMediaDevices = () => {
  const [devices, setDevices] = useState<Devices>({
    audio: [],
    video: [],
  });

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      logMedia("Done enumerating devices:", mediaDevices);

      const audio = mediaDevices.filter((x) => x.kind === "audioinput");
      const video = mediaDevices.filter((x) => x.kind === "videoinput");

      setDevices({ audio, video });
    });
  }, []);

  return {
    audioDevices: devices.audio,
    videoDevices: devices.video,
  };
};
