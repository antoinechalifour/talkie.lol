// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

class EventTarget {
  private eventMap = new Map<string, EventListener[]>();

  dispatchEvent(event: Event): boolean {
    const listeners = this.eventMap.get(event.type) || [];

    listeners.forEach((listener) => listener(event));

    return true;
  }

  addEventListener(type: string, listener: EventListener): void {
    const listeners = this.eventMap.get(type) || [];

    listeners.push(listener);

    this.eventMap.set(type, listeners);
  }

  removeEventListener(type: string, callback: EventListener): void {
    const listeners = this.eventMap.get(type) || [];

    this.eventMap.set(
      type,
      listeners.filter((x) => x !== callback)
    );
  }
}

window.EventTarget = EventTarget;

// @ts-ignore
window.MediaStream = class extends EventTarget {};
// @ts-ignore
window.MediaStreamTrack = class extends EventTarget {};
// @ts-ignore
window.MediaStreamTrackEvent = class extends Event {
  private track: MediaStreamTrack;
  constructor(type: string, dict: any) {
    super(type, dict);
    this.track = dict.track;
  }
};
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

// @ts-ignore
navigator.connection = new (class extends EventTarget {})();

// @ts-ignore
window.MediaQueryList = class extends EventTarget {};

// @ts-ignore
window.MediaQueryListEvent = class extends Event {
  private matches: boolean;

  constructor(type: string, { matches }: { matches: boolean }) {
    super(type);
    this.matches = matches;
  }
};
