import { Conference } from "../models/Conference";
import { RemotePeer } from "../models/RemotePeer";
import { RemoteUser } from "../models/RemoteUser";
import { CurrentUser } from "../models/CurrentUser";
import { Message } from "../models/Message";
import { PushableAsyncIterator } from "../utils/PushableAsyncIterator";

export class ConferenceViewModel {
  private _messageAddedObservers: Set<
    PushableAsyncIterator<Message>
  > = new Set();
  private _remotePeersChangedObservers: Set<
    PushableAsyncIterator<RemotePeer[]>
  > = new Set();
  private _localUserChangedObservers: Set<
    PushableAsyncIterator<CurrentUser>
  > = new Set();
  private _remotePeerAddedObservers: Set<
    PushableAsyncIterator<RemotePeer>
  > = new Set();
  private _remotePeerRemovedObservers: Set<
    PushableAsyncIterator<RemotePeer>
  > = new Set();

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

  observeLocalUser() {
    const iterator = new PushableAsyncIterator<CurrentUser>();

    this._localUserChangedObservers.add(iterator);

    return this._makeEventIterator(iterator, () =>
      this._localUserChangedObservers.delete(iterator)
    );
  }

  addRemotePeer(newRemotePeer: RemotePeer) {
    this.conference.addRemotePeer(newRemotePeer);
    this._notifyRemotePeerAdded(newRemotePeer);
  }

  observePeerAdded() {
    const iterator = new PushableAsyncIterator<RemotePeer>();

    this._remotePeerAddedObservers.add(iterator);

    return this._makeEventIterator(iterator, () =>
      this._remotePeerAddedObservers.delete(iterator)
    );
  }

  removeRemotePeer(remotePeer: RemotePeer) {
    this.conference.removeRemotePeer(remotePeer);
    this._notifyRemotePeerRemoved(remotePeer);
  }

  observePeerRemoved() {
    const iterator = new PushableAsyncIterator<RemotePeer>();

    this._remotePeerRemovedObservers.add(iterator);

    return this._makeEventIterator(iterator, () =>
      this._remotePeerRemovedObservers.delete(iterator)
    );
  }

  observePeersChanged() {
    const iterator = new PushableAsyncIterator<RemotePeer[]>();

    this._remotePeersChangedObservers.add(iterator);

    return this._makeEventIterator(iterator, () =>
      this._remotePeersChangedObservers.delete(iterator)
    );
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

  observeNewMessages() {
    const iterator = new PushableAsyncIterator<Message>();
    this._messageAddedObservers.add(iterator);

    return this._makeEventIterator(iterator, () =>
      this._messageAddedObservers.delete(iterator)
    );
  }

  userById(userId: string) {
    return this.conference.userById(userId);
  }

  leave() {
    this.conference.leave();
  }

  private _notifyRemotePeerAdded(newRemotePeer: RemotePeer) {
    this._remotePeerAddedObservers.forEach((iterator) =>
      iterator.pushValue(newRemotePeer)
    );
    this._notifyRemotePeersChanged();
  }

  private _notifyRemotePeerRemoved(remotePeer: RemotePeer) {
    this._remotePeerRemovedObservers.forEach((iterator) =>
      iterator.pushValue(remotePeer)
    );
    this._notifyRemotePeersChanged();
  }

  private _notifyRemotePeersChanged() {
    this._remotePeersChangedObservers.forEach((iterator) =>
      iterator.pushValue(this.allRemotePeers())
    );
  }

  private _notifyMessageAdded(message: Message) {
    this._messageAddedObservers.forEach((iterator) =>
      iterator.pushValue(message)
    );
  }

  static create(conference: Conference) {
    return new ConferenceViewModel(conference);
  }

  private _makeEventIterator<T>(
    iterator: PushableAsyncIterator<T>,
    cleanUpFn: () => unknown
  ) {
    return {
      [Symbol.asyncIterator](): AsyncIterableIterator<T> {
        return this;
      },
      next(): Promise<IteratorResult<T, void>> {
        return iterator.next();
      },
      cancel() {
        cleanUpFn();
        iterator.return();
      },
      async subscribe(callback: (result: T) => void) {
        for await (const value of this) {
          callback(value);
        }
      },
    };
  }
}
