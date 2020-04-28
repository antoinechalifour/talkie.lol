import React, { useEffect, useMemo, useState } from "react";

import { pictureInPictureContext } from "./pictureInPictureContext";
import { isPictureInPictureSupported } from "../../../../utils/featureDetection";

export const PictureInPictureProvider: React.FC = ({ children }) => {
  const [videoId, setVideoId] = useState<string | null>(null);

  const pictureInPicture = useMemo(
    () => ({
      isSupported: isPictureInPictureSupported(),
      videoId,
      setVideoId,
    }),
    [videoId, setVideoId]
  );

  useEffect(() => {
    if (!pictureInPicture.isSupported) return;

    const onVisibilityChanged = () => {
      if (document.visibilityState === "visible") {
        if (!document.pictureInPictureElement) return;

        document.exitPictureInPicture();
      } else if (pictureInPicture.videoId) {
        const video = document.querySelector(
          `#${pictureInPicture.videoId}`
        ) as HTMLVideoElement;

        if (!video) return;

        video.requestPictureInPicture();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChanged);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChanged);
    };
  }, [pictureInPicture.isSupported, pictureInPicture.videoId]);

  return (
    <pictureInPictureContext.Provider value={pictureInPicture}>
      {children}
    </pictureInPictureContext.Provider>
  );
};
