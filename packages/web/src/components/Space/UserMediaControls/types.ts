export type AudioInputOption =
  | {
      type: "none";
    }
  | {
      type: "device";
      device: MediaDeviceInfo;
    };

export type VideoInputOption =
  | {
      type: "none";
    }
  | {
      type: "screen";
    }
  | {
      type: "device";
      device: MediaDeviceInfo;
    };
