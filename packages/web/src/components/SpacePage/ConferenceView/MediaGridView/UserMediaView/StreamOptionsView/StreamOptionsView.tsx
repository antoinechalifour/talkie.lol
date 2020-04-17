import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress } from "@fortawesome/free-solid-svg-icons";

import { PictureInPictureLabel, StreamOptionsLayout } from "./styles";
import { useStreamOptionsView } from "./useStreamOptionsView";

export interface StreamOptionsViewProps {
  videoId: string;
}

export const StreamOptionsView: React.FC<StreamOptionsViewProps> = ({
  videoId,
}) => {
  const {
    isPictureInPictureEnabled,
    togglePictureInPicture,
  } = useStreamOptionsView(videoId);

  return (
    <StreamOptionsLayout>
      <PictureInPictureLabel>
        <input
          type="checkbox"
          checked={isPictureInPictureEnabled}
          onChange={togglePictureInPicture}
        />

        <FontAwesomeIcon icon={faCompress} />
      </PictureInPictureLabel>
    </StreamOptionsLayout>
  );
};
