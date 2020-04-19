export interface PictureInPictureState {
  isSupported: boolean;
  videoId: string | null;
  setVideoId: (videoId: string | null) => void;
}
