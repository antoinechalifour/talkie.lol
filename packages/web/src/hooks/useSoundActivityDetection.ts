import debug from "debug";
import { useCallback, useEffect, useRef, useState } from "react";

import { SoundActivityDetection } from "../services/SoundActivityDetection";

const log = debug("app:useSoundActivityDetection");

export const useSoundActivityDetection = (mediaStream: MediaStream) => {
  const soundActivityDetectionRef = useRef<SoundActivityDetection | null>(null);
  const [hasSound, setHasSound] = useState(false);

  const initializeSoundActivityDetection = useCallback(() => {
    log("Stopping current detection");
    soundActivityDetectionRef.current?.stop();

    log("Initializing sound activity detection");
    if (mediaStream.getAudioTracks().length === 0) {
      log("Current media stream does not have any audio track");
      soundActivityDetectionRef.current = null;
      return;
    }

    const soundActivityDetection = new SoundActivityDetection(mediaStream);

    soundActivityDetection.onSoundActivityChanged(setHasSound);
    soundActivityDetection.start();
    soundActivityDetectionRef.current = soundActivityDetection;
  }, [mediaStream]);

  useEffect(() => {
    initializeSoundActivityDetection();

    const soundActivityDetection = soundActivityDetectionRef.current;

    mediaStream.addEventListener("addtrack", initializeSoundActivityDetection);
    mediaStream.addEventListener(
      "removetrack",
      initializeSoundActivityDetection
    );

    return () => {
      log("Stopping current detection");
      soundActivityDetection?.stop();

      mediaStream.removeEventListener(
        "addtrack",
        initializeSoundActivityDetection
      );
      mediaStream.removeEventListener(
        "removetrack",
        initializeSoundActivityDetection
      );
    };
  }, [initializeSoundActivityDetection, mediaStream]);

  return hasSound;
};
