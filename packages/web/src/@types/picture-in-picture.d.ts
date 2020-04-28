interface Document {
  pictureInPictureElement: HTMLVideoElement | null;
  exitPictureInPicture(): void;
  pictureInPictureEnabled?: boolean;
}

interface HTMLVideoElement {
  requestPictureInPicture(): void;
}
