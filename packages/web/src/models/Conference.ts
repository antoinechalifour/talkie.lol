import debug from "debug";

import { RemotePeer } from "./RemotePeer";
import { CurrentUser } from "./CurrentUser";
import { RemoteUser } from "./RemoteUser";
import { Message } from "./Message";
import { TextMessage } from "./TextMessage";
import { ImageMessage } from "./ImageMessage";
import { FilePreviewMessage } from "./FilePreviewMessage";

const log = debug("app:Conference");

export class Conference {
  private _remotePeers: Set<RemotePeer> = new Set();
  private _messages: Message[] = [];
  private _files: Set<File> = new Set();

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

  hasPeer(remotePeer: RemotePeer) {
    return this.allRemotePeers().some((peer) => peer.is(remotePeer));
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
    const message = TextMessage.createTextMessage(
      {
        id: this.localUser().id(),
        name: this.localUser().name(),
      },
      messageContent
    );

    this._sendMessage(message);

    return message;
  }

  sendImage(image: string) {
    const message = ImageMessage.createImageMessage(
      {
        id: this.localUser().id(),
        name: this.localUser().name(),
      },
      image
    );

    this._sendMessage(message);

    return message;
  }

  addMessage(message: Message) {
    this._messages.push(message);
  }

  files() {
    return Array.from(this._files);
  }

  makeFileAvailable(file: File) {
    this._files.add(file);

    const message = FilePreviewMessage.createFilePreviewMessage(
      {
        id: this.localUser().id(),
        name: this.localUser().name(),
      },
      {
        fileId: file.lastModified.toString(),
        fileName: file.name,
        mimeType: file.type,
      }
    );

    this._sendMessage(message);

    return message;
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

  private _sendMessage(message: Message) {
    this._messages.push(message);
    this.allRemotePeers().forEach((peer) =>
      this.localUser().sendMessageToRemotePeer(message, peer)
    );
  }
}
