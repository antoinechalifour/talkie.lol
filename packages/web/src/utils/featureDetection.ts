export const isWebRtcSupported = () => !!window.RTCPeerConnection;

export const isWebAudioSupported = () => !!window.AudioContext;

export const isBrowserSupported = () =>
  isWebRtcSupported() && isWebAudioSupported();

export const isPictureInPictureSupported = () =>
  !!document.pictureInPictureEnabled;

export const isSharingScreenSupported = () =>
  !!navigator.mediaDevices.getDisplayMedia;
