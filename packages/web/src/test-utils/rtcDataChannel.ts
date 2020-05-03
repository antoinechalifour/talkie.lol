export const mockRtcDataChannel = (): RTCDataChannel =>
  new (class extends RTCDataChannel {
    constructor() {
      super();

      this.send = jest.fn();
      this.close = jest.fn();
    }
  })();
