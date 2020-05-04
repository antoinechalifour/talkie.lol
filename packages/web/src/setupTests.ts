// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// @ts-ignore
window.MediaStream = class extends EventTarget {};
// @ts-ignore
window.MediaStreamTrack = class extends EventTarget {};
// @ts-ignore
window.RTCPeerConnection = class extends EventTarget {};
// @ts-ignore
window.RTCDataChannel = class extends EventTarget {};
// @ts-ignore
window.RTCRtpSender = class extends EventTarget {};

// @ts-ignore
navigator.mediaDevices = new (class extends EventTarget {
  ondevicechange = null;
  enumerateDevices = jest.fn();
  getSupportedConstraints = jest.fn();
  getUserMedia = jest.fn();
  getDisplayMedia = jest.fn();
})();
