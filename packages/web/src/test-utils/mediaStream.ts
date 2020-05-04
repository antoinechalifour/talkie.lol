export class MockMediaStream extends MediaStream {
  getTracks = jest.fn().mockReturnValue([]);
  getVideoTracks = jest.fn().mockReturnValue([]);
  getAudioTracks = jest.fn().mockReturnValue([]);
  addTrack = jest.fn();
  removeTrack = jest.fn();
  getTrackById = jest.fn();

  static create() {
    return new MockMediaStream();
  }
}

export class MockMediaStreamTrack extends MediaStreamTrack {
  applyConstraints = jest.fn();
  getCapabilities = jest.fn();
  getConstraints = jest.fn();
  getSettings = jest.fn();
  stop = jest.fn();

  constructor(id: string, kind: string) {
    super();

    Object.assign(this, { id, kind });
  }

  static createAudioTrack(id: string) {
    return new MockMediaStreamTrack(id, "audio");
  }

  static createVideoTrack(id: string) {
    return new MockMediaStreamTrack(id, "video");
  }
}
