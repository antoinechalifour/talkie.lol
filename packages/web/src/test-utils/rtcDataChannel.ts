export class MockRtcDataChannel extends RTCDataChannel {
  send = jest.fn();
  close = jest.fn();

  static create() {
    return new MockRtcDataChannel();
  }
}
