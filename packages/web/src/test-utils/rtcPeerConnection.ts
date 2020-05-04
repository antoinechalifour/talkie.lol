export class MockRtcPeerConnection extends RTCPeerConnection {
  createDataChannel = jest.fn();
  getSenders = jest.fn().mockReturnValue([]);
  getTransceivers = jest.fn().mockReturnValue([]);
  addTransceiver = jest.fn();
  getReceivers = jest.fn().mockReturnValue([]);
  addTrack = jest.fn();
  removeTrack = jest.fn();
  createOffer = jest.fn();
  createAnswer = jest.fn();
  addIceCandidate = jest.fn();
  setLocalDescription = jest.fn();
  setRemoteDescription = jest.fn();
  close = jest.fn();

  static create() {
    return new MockRtcPeerConnection();
  }
}
