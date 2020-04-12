import { RemotePeer } from "./RemotePeer";
import { CurrentUser } from "./CurrentUser";
import { User } from "../webrtc/types";

type OnLocalUserChangedListener = (localUser: CurrentUser) => void;
type OnRemotePeerAddedListener = (newPeer: RemotePeer) => void;
type OnRemotePeerRemovedListener = (oldPeer: RemotePeer) => void;
type OnRemotePeersChangedListener = (peers: RemotePeer[]) => void;

export class Conference {
  private _remotePeers: Set<RemotePeer> = new Set();
  private _onLocalUserChangedListeners: OnLocalUserChangedListener[] = [];
  private _onRemotePeerAddedListeners: OnRemotePeerAddedListener[] = [];
  private _onRemotePeerRemovedListeners: OnRemotePeerRemovedListener[] = [];
  private _onRemotePeersChangedListeners: OnRemotePeersChangedListener[] = [];

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

  onLocalUserChanged(listener: OnLocalUserChangedListener) {
    this._onLocalUserChangedListeners.push(listener);

    return () => {
      this._onLocalUserChangedListeners = this._onLocalUserChangedListeners.filter(
        (x) => x !== listener
      );
    };
  }

  addLocalUserMediaStream(mediaStream: MediaStream) {
    this.localUser().addMediaStream(mediaStream);
    this._notifyLocalUserChanged();

    this.allRemotePeers().forEach((peer) =>
      this._currentUser.startStreamingWithRemotePeer(peer)
    );
  }

  removeLocalUserMediaStream() {
    this.localUser().removeMediaStream();
    this._notifyLocalUserChanged();

    this.allRemotePeers().forEach((peer) =>
      this._currentUser.stopStreamingWithRemotePeer(peer)
    );
  }

  addRemotePeer(newRemotePeer: RemotePeer) {
    this._remotePeers.add(newRemotePeer);
    this._notifyRemotePeerAdded(newRemotePeer);

    this._currentUser.startStreamingWithRemotePeer(newRemotePeer);
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
    this._remotePeers.delete(remotePeer);
    this._notifyRemotePeerRemoved(remotePeer);
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

  removeRemoteUser(user: User) {
    const remotePeer = this.getRemotePeerByUser(user);

    if (!remotePeer) return;

    this.removeRemotePeer(remotePeer);
  }

  getRemotePeerByUser(user: User): RemotePeer | null {
    return this.allRemotePeers().find((peer) => peer.isUser(user)) || null;
  }

  allRemotePeers(): RemotePeer[] {
    return Array.from(this._remotePeers);
  }

  static create(slug: string, currentUser: CurrentUser) {
    return new Conference(slug, currentUser);
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

  private _notifyLocalUserChanged() {
    this._onLocalUserChangedListeners.forEach((listener) =>
      listener(this.localUser())
    );
  }
}
