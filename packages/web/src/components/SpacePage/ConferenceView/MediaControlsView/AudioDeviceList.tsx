import React from "react";

import { DropdownOptionButton } from "../../../ui/DropdownButton";

export interface AudioDeviceListProps {
  audioDevices: MediaDeviceInfo[];
  shareAudioDevice: (id: string) => void;
}

export const AudioDeviceList: React.FC<AudioDeviceListProps> = ({
  audioDevices,
  shareAudioDevice,
}) => (
  <ul>
    {audioDevices.map((device) => (
      <li key={device.deviceId}>
        <DropdownOptionButton onClick={() => shareAudioDevice(device.deviceId)}>
          {device.label}
        </DropdownOptionButton>
      </li>
    ))}
  </ul>
);
