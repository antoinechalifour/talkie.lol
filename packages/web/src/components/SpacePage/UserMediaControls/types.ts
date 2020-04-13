export type AudioInputOption =
  | {
      id: string;
      type: "none";
    }
  | {
      id: string;
      type: "device";
      device: MediaDeviceInfo;
    };

export type VideoInputOption =
  | {
      id: string;
      type: "none";
    }
  | {
      id: string;
      type: "screen";
    }
  | {
      id: string;
      type: "device";
      device: MediaDeviceInfo;
    };
