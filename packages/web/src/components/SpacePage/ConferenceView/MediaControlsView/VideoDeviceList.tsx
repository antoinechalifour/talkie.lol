import React from "react";

import { DropdownOptionButton } from "../../../ui/DropdownButton";

export interface VideoDeviceListProps {
  videoDevices: MediaDeviceInfo[];
  shareVideoDevice: (id: string) => void;
}

export const VideoDeviceList: React.FC<VideoDeviceListProps> = ({
  videoDevices,
  shareVideoDevice,
}) => (
  <ul>
    {videoDevices.map((device) => (
      <li key={device.deviceId}>
        <DropdownOptionButton onClick={() => shareVideoDevice(device.deviceId)}>
          {device.label}
        </DropdownOptionButton>
      </li>
    ))}
  </ul>
);
