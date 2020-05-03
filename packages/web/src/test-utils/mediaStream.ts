export const mockMediaStream = (): MediaStream =>
  new (class extends MediaStream {
    constructor() {
      super();
      this.getTracks = jest.fn().mockReturnValue([]);
      this.getVideoTracks = jest.fn().mockReturnValue([]);
      this.getAudioTracks = jest.fn().mockReturnValue([]);

      this.addTrack = jest.fn();
      this.removeTrack = jest.fn();

      this.getTrackById = jest.fn();
    }
  })();
