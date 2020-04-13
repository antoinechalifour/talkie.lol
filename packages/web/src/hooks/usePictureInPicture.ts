import { useCallback, useEffect, useState } from "react";

import { RemotePeer } from "../models/RemotePeer";

export const usePictureInPicture = () => {
  const [currentPeer, setCurrentPeer] = useState<RemotePeer | null>(null);

  useEffect(() => {
    const onVisibilityChanged = () => {
      if (document.visibilityState === "visible") {
        // @ts-ignore
        if (!document.pictureInPictureElement) return;

        // @ts-ignore
        document.exitPictureInPicture();
      } else if (currentPeer) {
        const video = document.querySelector(`#stream-${currentPeer.id()}`);

        if (!video) return;

        // @ts-ignore
        video.requestPictureInPicture();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChanged);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChanged);
    };
  }, [currentPeer]);

  const removeCurrentPeer = useCallback(() => setCurrentPeer(null), [
    setCurrentPeer,
  ]);

  return {
    currentPeer,
    setCurrentPeer,
    removeCurrentPeer,
  };
};
