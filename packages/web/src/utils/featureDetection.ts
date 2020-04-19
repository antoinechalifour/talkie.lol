export const isWebRtcSupported = () => !!window.RTCPeerConnection;

export const isWebAudioSupported = () => !!window.AudioContext;

export const isBrowserSupported = () =>
  isWebRtcSupported() && isWebAudioSupported();

export const isPictureInPictureSupported = () =>
  // @ts-ignore
  !!document.pictureInPictureEnabled;
