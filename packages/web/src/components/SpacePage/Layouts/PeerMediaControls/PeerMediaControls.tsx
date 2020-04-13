import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";

import { ControlButton, ExpandButton, MediaControlsWrapper } from "./styles";

interface PeerMediaControlsProps {
  isPresenterModeEnabled: boolean;
  onPresenterModeEnabled: () => void;
  onPresenterModeDisabled: () => void;
  onPInPEnabled: () => void;
  onPInPDisabled: () => void;
  isPinPEnabled: boolean;
}

export const PeerMediaControls: React.FC<PeerMediaControlsProps> = ({
  isPresenterModeEnabled,
  onPInPEnabled,
  onPInPDisabled,
  isPinPEnabled,
  onPresenterModeEnabled,
  onPresenterModeDisabled,
}) => {
  const togglePresenterMode = useCallback(
    () =>
      isPresenterModeEnabled
        ? onPresenterModeDisabled()
        : onPresenterModeEnabled(),
    [isPresenterModeEnabled, onPresenterModeDisabled, onPresenterModeEnabled]
  );

  const togglePInPMode = useCallback(
    () => (isPinPEnabled ? onPInPDisabled() : onPInPEnabled()),
    [isPinPEnabled, onPInPDisabled, onPInPEnabled]
  );

  return (
    <MediaControlsWrapper>
      <ControlButton
        title="Enable picture-in-picture for this user"
        aria-pressed={isPinPEnabled}
        onClick={togglePInPMode}
      >
        <FontAwesomeIcon icon={faCompress} />
      </ControlButton>

      <ExpandButton
        title="Set this user as the presenter"
        aria-pressed={isPresenterModeEnabled}
        onClick={togglePresenterMode}
      >
        <FontAwesomeIcon icon={faExpand} />
      </ExpandButton>
    </MediaControlsWrapper>
  );
};
