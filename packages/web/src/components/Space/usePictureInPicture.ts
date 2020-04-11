import { useEffect, useRef } from "react";

import { RemotePeer } from "./RemotePeer";

interface UsePictureInPictureOptions {
  remotePeers: RemotePeer[];
}

const pipVideo = document.createElement("video");
const renderer = document.createElement("canvas");
const ctx = renderer.getContext("2d");

// @ts-ignore
window.PIP_CANVAS = renderer;
// @ts-ignore
window.PIP_VIDEO = pipVideo;

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const usePictureInPicture = ({
  remotePeers,
}: UsePictureInPictureOptions) => {
  useEffect(() => {
    const onVisibilityChanged = () => {
      if (document.visibilityState === "visible") {
        // @ts-ignore
        if (document.pictureInPictureElement) {
          console.log(">>>>>>> Exiting PIP <<<<<<<");
          // @ts-ignore
          document.exitPictureInPicture();
        }
      } else {
        console.log(">>>>>>> Entering PIP <<<<<<<");
        pipVideo.play();
        // @ts-ignore
        pipVideo.requestPictureInPicture().catch((e) => {
          // Do nothing
          console.log("PIP Error:", e);
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChanged);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChanged);
    };
  }, []);

  useEffect(() => {
    // @ts-ignore
    pipVideo.srcObject = renderer.captureStream(60);
    pipVideo.muted = true;
  }, []);

  useInterval(() => {
    const cache = new Map<
      string,
      { v: HTMLVideoElement; w: number; h: number }
    >();
    let cumulativeHeight = 0;

    for (const peer of remotePeers) {
      const video = document.querySelector(
        `#stream-${peer.id()}`
      ) as HTMLVideoElement | null;

      if (!video) {
        continue;
      }

      const realWidth = video.videoWidth;
      const realHeight = video.videoHeight;
      const ratio = realWidth / realHeight;
      const scaledWidth = 500;
      const scaledHeight = scaledWidth / ratio;

      cache.set(peer.id(), {
        v: video,
        w: scaledWidth,
        h: scaledHeight,
      });

      cumulativeHeight += scaledHeight;
    }

    renderer.width = 500;
    renderer.height = cumulativeHeight;

    let currentHeight = 0;

    for (const peer of remotePeers) {
      const info = cache.get(peer.id())!;

      if (!info) {
        continue;
      }

      ctx!.drawImage(info.v, 0, currentHeight, 500, info.h);

      currentHeight += info.h;
    }
  }, 1000 / 24);
};
