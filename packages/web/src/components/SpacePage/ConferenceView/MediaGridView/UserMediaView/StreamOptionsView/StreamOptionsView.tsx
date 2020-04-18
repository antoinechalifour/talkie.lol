import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faExpand } from "@fortawesome/free-solid-svg-icons";

import { useZenMode } from "../../../useZenMode";
import { useStreamOptionsView } from "./useStreamOptionsView";
import { OptionLabel, StreamOptionsLayout } from "./styles";

export interface StreamOptionsViewProps {
  videoId: string;
  userId: string;
}

export const StreamOptionsView: React.FC<StreamOptionsViewProps> = ({
  videoId,
  userId,
}) => {
  const {
    isPictureInPictureEnabled,
    togglePictureInPicture,
  } = useStreamOptionsView(videoId);

  const zenMode = useZenMode();
  const isZenModeEnabled = zenMode.userId === userId;
  const enterZenMode = useCallback(() => zenMode.enterZenMode(userId), [
    userId,
    zenMode,
  ]);

  return (
    <StreamOptionsLayout>
      <OptionLabel title="Enter zend mode for this user">
        <input
          type="checkbox"
          checked={isZenModeEnabled}
          onChange={enterZenMode}
        />

        <FontAwesomeIcon icon={faExpand} />
      </OptionLabel>
      <OptionLabel title="Enable picture in picture for this user">
        <input
          type="checkbox"
          checked={isPictureInPictureEnabled}
          onChange={togglePictureInPicture}
        />

        <FontAwesomeIcon icon={faCompress} />
      </OptionLabel>
    </StreamOptionsLayout>
  );
};
