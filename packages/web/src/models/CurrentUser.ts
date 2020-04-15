import debug from "debug";

import { RemotePeer } from "./RemotePeer";
import { User } from "./User";

const log = debug("app:CurrentUser");

export class CurrentUser implements User {
  private constructor(
    private _id: string,
    private _token: string,
    private _name: string,
    private _rtcConfiguration: RTCConfiguration,
    private _localMediaStream: MediaStream
  ) {}

  id() {
    return "me";
  }

  name() {
    return this._name;
  }

  token() {
    return this._token;
  }

  rtcConfiguration() {
    return this._rtcConfiguration;
  }

  mediaStream() {
    return this._localMediaStream;
  }

  // addMediaStream(mediaStream: MediaStream) {
  //   log("Adding media stream");
  //   this._localMediaStream = mediaStream;
  // }
  //
  // removeMediaStream() {
  //   log("Removing media stream");
  //   this._localMediaStream = null;
  // }

  startStreamingWithRemotePeer(remotePeer: RemotePeer) {
    log(`Sending local stream to ${remotePeer.name()}`);
    remotePeer.startStreaming(this._localMediaStream);
  }

  stopStreamingWithRemotePeer(remotePeer: RemotePeer) {
    log(`Stopping streaming with ${remotePeer.name()}`);
    remotePeer.stopStreaming();
  }

  static create(
    id: string,
    token: string,
    name: string,
    rtcConfiguration: RTCConfiguration,
    mediaStream: MediaStream
  ) {
    return new CurrentUser(id, token, name, rtcConfiguration, mediaStream);
  }
}
