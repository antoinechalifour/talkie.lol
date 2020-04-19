import { useCallback } from "react";

import { usePictureInPicture } from "../../../PictureInPicture/usePictureInPicture";

export const useStreamOptionsView = (videoId: string) => {
  const pictureInPicture = usePictureInPicture();
  const isPictureInPictureEnabled = pictureInPicture.videoId === videoId;

  const togglePictureInPicture = useCallback(() => {
    if (isPictureInPictureEnabled) pictureInPicture.setVideoId(null);
    else pictureInPicture.setVideoId(videoId);
  }, [isPictureInPictureEnabled, pictureInPicture, videoId]);

  return {
    isPictureInPictureSupported: pictureInPicture.isSupported,
    isPictureInPictureEnabled,
    togglePictureInPicture,
  };
};
