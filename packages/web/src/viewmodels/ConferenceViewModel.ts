import { Conference } from "../models/Conference";
import { RemotePeer } from "../models/RemotePeer";
import { RemoteUser } from "../models/RemoteUser";
import { CurrentUser } from "../models/CurrentUser";
import { Message } from "../models/Message";

type OnLocalUserChangedListener = (localUser: CurrentUser) => void;
type OnRemotePeerAddedListener = (newPeer: RemotePeer) => void;
type OnRemotePeerRemovedListener = (oldPeer: RemotePeer) => void;
type OnRemotePeersChangedListener = (peers: RemotePeer[]) => void;
type OnMessageAddedListener = (message: Message) => void;

export class ConferenceViewModel {
  private _onLocalUserChangedListeners: OnLocalUserChangedListener[] = [];
  private _onRemotePeerAddedListeners: OnRemotePeerAddedListener[] = [];
  private _onRemotePeerRemovedListeners: OnRemotePeerRemovedListener[] = [];
  private _onRemotePeersChangedListeners: OnRemotePeersChangedListener[] = [];
  private _onMessageAddedListeners: OnMessageAddedListener[] = [];

  private constructor(private conference: Conference) {}

  name() {
    return this.conference.name();
  }

  localUser() {
    return this.conference.localUser();
  }

  messages() {
    return this.conference.messages();
  }

  // TODO: pretty sure this is useless
  onLocalUserChanged(listener: OnLocalUserChangedListener) {
    this._onLocalUserChangedListeners.push(listener);

    return () => {
      this._onLocalUserChangedListeners = this._onLocalUserChangedListeners.filter(
        (x) => x !== listener
      );
    };
  }

  addRemotePeer(newRemotePeer: RemotePeer) {
    this.conference.addRemotePeer(newRemotePeer);
    this._notifyRemotePeerAdded(newRemotePeer);
  }

  onRemotePeerAdded(listener: OnRemotePeerAddedListener) {
    this._onRemotePeerAddedListeners.push(listener);

    return () => {
      this._onRemotePeerAddedListeners = this._onRemotePeerAddedListeners.filter(
        (x) => x !== listener
      );
    };
  }

  removeRemotePeer(remotePeer: RemotePeer) {
    if (this.conference.hasPeer(remotePeer)) {
      this.conference.removeRemotePeer(remotePeer);
      this._notifyRemotePeerRemoved(remotePeer);
    }
  }

  onRemotePeerRemoved(listener: OnRemotePeerRemovedListener) {
    this._onRemotePeerRemovedListeners.push(listener);

    return () => {
      this._onRemotePeerRemovedListeners = this._onRemotePeerRemovedListeners.filter(
        (x) => x !== listener
      );
    };
  }

  onRemotePeersChanged(listener: OnRemotePeersChangedListener) {
    this._onRemotePeersChangedListeners.push(listener);

    return () => {
      this._onRemotePeersChangedListeners = this._onRemotePeersChangedListeners.filter(
        (x) => x !== listener
      );
    };
  }

  removeRemoteUser(user: RemoteUser) {
    const remotePeer = this.remotePeerByUser(user);

    if (!remotePeer) return;

    this.conference.removeRemoteUser(user);
    this._notifyRemotePeerRemoved(remotePeer);
  }

  remotePeerByUser(user: RemoteUser): RemotePeer | null {
    return this.conference.remotePeerByUser(user);
  }

  allRemotePeers(): RemotePeer[] {
    return this.conference.allRemotePeers();
  }

  startLocalAudio(audioTracks: MediaStreamTrack[]) {
    this.conference.startLocalAudio(audioTracks);
  }

  stopLocalAudio() {
    this.conference.stopLocalAudio();
  }

  startLocalVideo(videoTracks: MediaStreamTrack[]) {
    this.conference.startLocalVideo(videoTracks);
  }

  stopLocalVideo() {
    this.conference.stopLocalVideo();
  }

  sendMessage(messageContent: string) {
    const message = this.conference.sendMessage(messageContent);

    this._notifyMessageAdded(message);

    return message;
  }

  sendImage(image: string) {
    const message = this.conference.sendImage(image);

    this._notifyMessageAdded(message);

    return message;
  }

  addMessage(message: Message) {
    this.conference.addMessage(message);
    this._notifyMessageAdded(message);
  }

  onMessageAdded(listener: OnMessageAddedListener) {
    this._onMessageAddedListeners.push(listener);

    return () => {
      this._onMessageAddedListeners = this._onMessageAddedListeners.filter(
        (x) => x !== listener
      );
    };
  }

  userById(userId: string) {
    return this.conference.userById(userId);
  }

  makeFileAvailable(file: File) {
    const message = this.conference.makeFileAvailable(file);

    this._notifyMessageAdded(message);

    return message;
  }

  leave() {
    this.conference.leave();
  }

  private _notifyRemotePeerAdded(newRemotePeer: RemotePeer) {
    this._onRemotePeerAddedListeners.forEach((listener) =>
      listener(newRemotePeer)
    );

    this._notifyRemotePeersChanged();
  }

  private _notifyRemotePeerRemoved(remotePeer: RemotePeer) {
    this._onRemotePeerRemovedListeners.forEach((listener) =>
      listener(remotePeer)
    );

    this._notifyRemotePeersChanged();
  }

  private _notifyRemotePeersChanged() {
    this._onRemotePeersChangedListeners.forEach((listener) =>
      listener(this.allRemotePeers())
    );
  }

  private _notifyMessageAdded(message: Message) {
    this._onMessageAddedListeners.forEach((listener) => listener(message));
  }

  static create(conference: Conference) {
    return new ConferenceViewModel(conference);
  }
}
