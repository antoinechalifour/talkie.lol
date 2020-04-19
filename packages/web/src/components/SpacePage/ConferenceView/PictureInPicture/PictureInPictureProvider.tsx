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
        // @ts-ignore
        if (!document.pictureInPictureElement) return;

        // @ts-ignore
        document.exitPictureInPicture();
      } else if (pictureInPicture.videoId) {
        const video = document.querySelector(`#${pictureInPicture.videoId}`);

        if (!video) return;

        // @ts-ignore
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
