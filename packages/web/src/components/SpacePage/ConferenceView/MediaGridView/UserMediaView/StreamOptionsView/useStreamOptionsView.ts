import { useCallback, useEffect } from "react";

import { usePictureInPicture } from "../../../usePictureInPicture";

export const useStreamOptionsView = (videoId: string) => {
  const pictureInPicture = usePictureInPicture();
  const isPictureInPictureEnabled =
    pictureInPicture.pictureInPictureVideoId === videoId;

  const togglePictureInPicture = useCallback(() => {
    if (isPictureInPictureEnabled)
      pictureInPicture.setPictureInPictureVideoId(null);
    else pictureInPicture.setPictureInPictureVideoId(videoId);
  }, [isPictureInPictureEnabled, pictureInPicture, videoId]);

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

  return {
    isPictureInPictureEnabled,
    togglePictureInPicture,
  };
};
