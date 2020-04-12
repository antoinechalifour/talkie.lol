import { RemotePeer } from "./RemotePeer";

export class CurrentUser {
  private _localMediaStream: MediaStream | null = null;

  private constructor(
    private _id: string,
    private _token: string,
    private _name: string
  ) {}

  name() {
    return this._name;
  }

  token() {
    return this._token;
  }

  mediaStream() {
    return this._localMediaStream;
  }

  addMediaStream(mediaStream: MediaStream) {
    this._localMediaStream = mediaStream;
  }

  removeMediaStream() {
    this._localMediaStream = null;
  }

  startStreamingWithRemotePeer(remotePeer: RemotePeer) {
    if (!this._localMediaStream) return;

    remotePeer.startStreaming(this._localMediaStream);
  }

  stopStreamingWithRemotePeer(remotePeer: RemotePeer) {
    remotePeer.stopStreaming();
  }

  static create(id: string, token: string, name: string) {
    return new CurrentUser(id, token, name);
  }
}
