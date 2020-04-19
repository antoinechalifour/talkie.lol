import React, { useEffect, useMemo, useState } from "react";

import { pictureInPictureContext } from "./pictureInPictureContext";

export const PictureInPictureProvider: React.FC = ({ children }) => {
  const [pictureInPictureVideoId, setPictureInPictureVideoId] = useState<
    string | null
  >(null);

  const pictureInPicture = useMemo(
    () => ({
      pictureInPictureVideoId,
      setPictureInPictureVideoId,
    }),
    [pictureInPictureVideoId, setPictureInPictureVideoId]
  );

  useEffect(() => {
    const onVisibilityChanged = () => {
      if (document.visibilityState === "visible") {
        // @ts-ignore
        if (!document.pictureInPictureElement) return;

        // @ts-ignore
        document.exitPictureInPicture();
      } else if (pictureInPicture.pictureInPictureVideoId) {
        const video = document.querySelector(
          `#${pictureInPicture.pictureInPictureVideoId}`
        );

        if (!video) return;

        // @ts-ignore
        video.requestPictureInPicture();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChanged);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChanged);
    };
  }, [pictureInPicture.pictureInPictureVideoId]);

  return (
    <pictureInPictureContext.Provider value={pictureInPicture}>
      {children}
    </pictureInPictureContext.Provider>
  );
};
