export class MockRtcDataChannel extends RTCDataChannel {
  send = jest.fn();
  close = jest.fn();

  constructor(label: string) {
    super();

    Object.assign(this, { label });
  }

  static create() {
    return new MockRtcDataChannel("");
  }

  static createChat() {
    return new MockRtcDataChannel("chat");
  }
}
