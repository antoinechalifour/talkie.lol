import { AudioInputOption, VideoInputOption } from "./types";

export const AUDIO_DISABLED_OPTION: AudioInputOption = {
  id: "audio-off",
  type: "none",
};

export const VIDEO_DISABLED_OPTION: VideoInputOption = {
  id: "video-off",
  type: "none",
};

export const SCREEN_SHARING_OPTION: VideoInputOption = {
  id: "video-screen",
  type: "screen",
};
