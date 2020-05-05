export class MockMediaStream extends MediaStream {
  private _tracks: MediaStreamTrack[] = [];

  getTracks() {
    return this._tracks;
  }

  getVideoTracks() {
    return this.getTracks().filter((track) => track.kind === "video");
  }

  getAudioTracks() {
    return this.getTracks().filter((track) => track.kind === "audio");
  }

  addTrack(track: MediaStreamTrack) {
    this._tracks.push(track);
  }

  removeTrack(track: MediaStreamTrack) {
    this._tracks = this._tracks.filter((x) => x !== track);
  }

  getTrackById(id: string) {
    return this._tracks.find((x) => x.id === id) || null;
  }

  static create() {
    return new MockMediaStream();
  }

  static createWithTracks(tracks: MediaStreamTrack[]) {
    const mediaStream = MockMediaStream.create();

    tracks.forEach((track) => mediaStream.addTrack(track));

    return mediaStream;
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
