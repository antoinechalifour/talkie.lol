import { Conference } from "../models/Conference";
import { RemotePeer } from "../models/RemotePeer";
import { RemoteUser } from "../models/RemoteUser";
import { CurrentUser } from "../models/CurrentUser";

type OnLocalUserChangedListener = (localUser: CurrentUser) => void;
type OnRemotePeerAddedListener = (newPeer: RemotePeer) => void;
type OnRemotePeerRemovedListener = (oldPeer: RemotePeer) => void;
type OnRemotePeersChangedListener = (peers: RemotePeer[]) => void;

export class ConferenceViewModel {
  private _onLocalUserChangedListeners: OnLocalUserChangedListener[] = [];
  private _onRemotePeerAddedListeners: OnRemotePeerAddedListener[] = [];
  private _onRemotePeerRemovedListeners: OnRemotePeerRemovedListener[] = [];
  private _onRemotePeersChangedListeners: OnRemotePeersChangedListener[] = [];

  private constructor(private conference: Conference) {}

  name() {
    return this.conference.name();
  }

  localUser() {
    return this.conference.localUser();
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
    this.conference.addLocalUserMediaStream(mediaStream);
    this._notifyLocalUserChanged();
  }

  removeLocalUserMediaStream() {
    this.conference.removeLocalUserMediaStream();
    this._notifyLocalUserChanged();
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
    this.conference.removeRemotePeer(remotePeer);
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

  static create(conference: Conference) {
    return new ConferenceViewModel(conference);
  }
}
