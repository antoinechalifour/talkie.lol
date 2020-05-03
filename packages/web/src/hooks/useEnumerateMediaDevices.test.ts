import { renderHook } from "@testing-library/react-hooks";

import { useEnumerateMediaDevices } from "./useEnumerateMediaDevices";

const audioInputDevice: MediaDeviceInfo = {
  deviceId: "audio-1",
  kind: "audioinput",
  groupId: "default",
  label: "test audio device 1",
  toJSON: jest.fn(),
};

const audioOutputDevice: MediaDeviceInfo = {
  deviceId: "audio-2",
  kind: "audiooutput",
  groupId: "default",
  label: "test audio device 2",
  toJSON: jest.fn(),
};

const videoInputDevice: MediaDeviceInfo = {
  deviceId: "video-1",
  kind: "videoinput",
  groupId: "default",
  label: "test video device 1",
  toJSON: jest.fn(),
};

describe("useEnumerateMediaDevices", () => {
  describe("when the enumeration is pending", () => {
    it("should return an empty array", async () => {
      // Given
      (navigator.mediaDevices.enumerateDevices as jest.Mock).mockResolvedValue([
        audioInputDevice,
      ]);

      // When
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnumerateMediaDevices()
      );

      // Then
      expect(result.current.audioDevices).toEqual([]);
      expect(result.current.videoDevices).toEqual([]);

      await waitForNextUpdate();
    });
  });

  describe("when the enumeration is ready", () => {
    it("should return the audio and video devices", async () => {
      // Given
      (navigator.mediaDevices.enumerateDevices as jest.Mock).mockResolvedValue([
        audioInputDevice,
        audioOutputDevice,
        videoInputDevice,
      ]);

      // When
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnumerateMediaDevices()
      );

      await waitForNextUpdate();

      // Then
      expect(result.current.audioDevices).toEqual([audioInputDevice]);
      expect(result.current.videoDevices).toEqual([videoInputDevice]);
    });
  });
});
