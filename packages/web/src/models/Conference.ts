import debug from "debug";

import { RemotePeer } from "./RemotePeer";
import { CurrentUser } from "./CurrentUser";
import { RemoteUser } from "./RemoteUser";
import { Message } from "./Message";

const log = debug("app:Conference");

export class Conference {
  private _remotePeers: Set<RemotePeer> = new Set();
  private _messages: Message[] = [];

  private constructor(
    private _name: string,
    private _currentUser: CurrentUser
  ) {}

  name() {
    return this._name;
  }

  localUser() {
    return this._currentUser;
  }

  messages() {
    return this._messages;
  }

  addRemotePeer(newRemotePeer: RemotePeer) {
    if (this._remotePeers.has(newRemotePeer)) return;

    log("Adding remote peer to conference");
    this._remotePeers.add(newRemotePeer);

    this._currentUser.startStreamingWithRemotePeer(newRemotePeer);
  }

  removeRemotePeer(remotePeer: RemotePeer) {
    log("Removing remote peer from conference");
    this._remotePeers.delete(remotePeer);
  }

  removeRemoteUser(user: RemoteUser) {
    log("Removing remote peer by user");
    const remotePeer = this.remotePeerByUser(user);

    if (!remotePeer) return;

    this.removeRemotePeer(remotePeer);
  }

  remotePeerByUser(user: RemoteUser): RemotePeer | null {
    return this.allRemotePeers().find((peer) => peer.isUser(user)) || null;
  }

  userById(userId: string) {
    if (this.localUser().id() === userId) return this.localUser();

    for (const peer of this.allRemotePeers()) {
      if (peer.id() === userId) {
        return peer;
      }
    }

    throw new Error(`User not found in conference: ${userId}`);
  }

  allRemotePeers(): RemotePeer[] {
    return Array.from(this._remotePeers);
  }

  startLocalAudio(audioTracks: MediaStreamTrack[]) {
    this.localUser().setAudioStream(audioTracks);
    this._startStreamingLocalMediaStreamWithAllPeers();
  }

  stopLocalAudio() {
    this.localUser().stopAudioStream();
    this._stopStreamingLocalMediaStreamWithAllPeers();
  }

  startLocalVideo(videoTracks: MediaStreamTrack[]) {
    this.localUser().setVideoStream(videoTracks);
    this._startStreamingLocalMediaStreamWithAllPeers();
  }

  stopLocalVideo() {
    this.localUser().stopVideoStream();
    this._stopStreamingLocalMediaStreamWithAllPeers();
  }

  sendMessage(messageContent: string) {
    const message = Message.create(
      {
        name: this.localUser().name(),
      },
      messageContent
    );

    this._messages.push(message);
    this.allRemotePeers().forEach((peer) =>
      this.localUser().sendMessageToRemotePeer(message.content(), peer)
    );

    return message;
  }

  addMessage(message: Message) {
    this._messages.push(message);
  }

  leave() {
    this.localUser().stopVideoStream();
    this.localUser().stopAudioStream();

    this.allRemotePeers().forEach((peer) => peer.closeConnection());
  }

  static create(slug: string, currentUser: CurrentUser) {
    return new Conference(slug, currentUser);
  }

  private _startStreamingLocalMediaStreamWithAllPeers() {
    this.allRemotePeers().forEach((peer) =>
      this.localUser().startStreamingWithRemotePeer(peer)
    );
  }

  private _stopStreamingLocalMediaStreamWithAllPeers() {
    this.allRemotePeers().forEach((peer) =>
      this.localUser().stopStreamingWithRemotePeer(peer)
    );
  }
}
