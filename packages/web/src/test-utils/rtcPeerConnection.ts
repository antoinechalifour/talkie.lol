export const mockRtcPeerConnection = (): RTCPeerConnection =>
  new (class extends RTCPeerConnection {
    constructor() {
      super();

      this.createDataChannel = jest.fn();
      this.getSenders = jest.fn().mockReturnValue([]);
      this.getTransceivers = jest.fn().mockReturnValue([]);
      this.addTransceiver = jest.fn();
      this.getReceivers = jest.fn().mockReturnValue([]);
      this.addTrack = jest.fn();
      this.removeTrack = jest.fn();
      this.createOffer = jest.fn();
      this.createAnswer = jest.fn();
      this.addIceCandidate = jest.fn();
      this.setLocalDescription = jest.fn();
      this.setRemoteDescription = jest.fn();
      this.close = jest.fn();
    }
  })();
