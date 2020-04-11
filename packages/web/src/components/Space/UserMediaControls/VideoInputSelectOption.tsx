import React from "react";

import { VideoInputOption } from "./types";

export interface VideoInputSelectOptionProps {
  option: VideoInputOption;
}

export const VideoInputSelectOption: React.FC<VideoInputSelectOptionProps> = ({
  option,
}) => {
  if (option.type === "none")
    return <option value="off">Do not share video</option>;
  if (option.type === "device")
    return (
      <option value={option.device.deviceId}>{option.device.label}</option>
    );

  return <option value="screen">Share your screen</option>;
};
