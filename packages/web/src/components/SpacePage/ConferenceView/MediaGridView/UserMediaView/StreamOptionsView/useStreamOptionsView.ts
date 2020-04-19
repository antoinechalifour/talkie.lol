import { useCallback } from "react";

import { usePictureInPicture } from "../../../PictureInPicture/usePictureInPicture";

export const useStreamOptionsView = (videoId: string) => {
  const pictureInPicture = usePictureInPicture();
  const isPictureInPictureEnabled =
    pictureInPicture.pictureInPictureVideoId === videoId;

  const togglePictureInPicture = useCallback(() => {
    if (isPictureInPictureEnabled)
      pictureInPicture.setPictureInPictureVideoId(null);
    else pictureInPicture.setPictureInPictureVideoId(videoId);
  }, [isPictureInPictureEnabled, pictureInPicture, videoId]);

  return {
    isPictureInPictureEnabled,
    togglePictureInPicture,
  };
};
