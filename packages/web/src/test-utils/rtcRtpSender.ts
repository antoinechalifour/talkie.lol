export class MockRTCRtpSender extends RTCRtpSender {
  getParameters = jest.fn();
  getStats = jest.fn();
  replaceTrack = jest.fn();
  setParameters = jest.fn();
  setStreams = jest.fn();

  constructor(track: MediaStreamTrack | null) {
    super();

    Object.assign(this, { track });
  }

  static createRTCRtpSender(track: MediaStreamTrack | null = null) {
    return new MockRTCRtpSender(track);
  }
}
