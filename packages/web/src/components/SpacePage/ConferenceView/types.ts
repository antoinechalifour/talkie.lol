export interface PictureInPictureState {
  pictureInPictureVideoId: string | null;
  setPictureInPictureVideoId: (videoId: string | null) => void;
}

export interface ZendModeState {
  userId: string | null;
  enterZenMode: (userId: string) => void;
  exitZenMode: () => void;
}
