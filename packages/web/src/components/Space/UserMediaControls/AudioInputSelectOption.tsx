import React from "react";

import { AudioInputOption } from "./types";

export interface AudioInputSelectOptionProps {
  option: AudioInputOption;
}

export const AudioInputSelectOption: React.FC<AudioInputSelectOptionProps> = ({
  option,
}) => {
  if (option.type === "none") return <option value="off">Mute input</option>;

  return <option value={option.device.deviceId}>{option.device.label}</option>;
};
