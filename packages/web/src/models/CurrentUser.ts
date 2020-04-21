import debug from "debug";

import { RemotePeer } from "./RemotePeer";
import { User } from "./User";
import { Message } from "./Message";

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

  startStreamingWithRemotePeer(remotePeer: RemotePeer) {
    log(`Sending local stream to ${remotePeer.name()}`);
    remotePeer.startStreaming(this._localMediaStream);
  }

  stopStreamingWithRemotePeer(remotePeer: RemotePeer) {
    log(`Stopping streaming with ${remotePeer.name()}`);
    remotePeer.stopStreaming();
  }

  setAudioStream(audioTracks: MediaStreamTrack[]) {
    this.stopAudioStream();

    for (const track of audioTracks) {
      this.mediaStream().addTrack(track);
    }
  }

  stopAudioStream() {
    for (const track of this.mediaStream().getAudioTracks()) {
      track.stop();
      this.mediaStream().removeTrack(track);
    }
  }

  setVideoStream(videoTracks: MediaStreamTrack[]) {
    this.stopVideoStream();

    for (const track of videoTracks) {
      this.mediaStream().addTrack(track);
    }
  }

  stopVideoStream() {
    for (const track of this.mediaStream().getVideoTracks()) {
      track.stop();
      this.mediaStream().removeTrack(track);
    }
  }

  sendMessageToRemotePeer(message: Message, peer: RemotePeer) {
    peer.sendMessage(message);
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
