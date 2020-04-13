import debug from "debug";

import { RemotePeer } from "./RemotePeer";
import { CurrentUser } from "./CurrentUser";
import { RemoteUser } from "./RemoteUser";

const log = debug("app:Conference");

export class Conference {
  private _remotePeers: Set<RemotePeer> = new Set();

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

  addLocalUserMediaStream(mediaStream: MediaStream) {
    log("Adding local user media stream");
    this.localUser().addMediaStream(mediaStream);

    this.allRemotePeers().forEach((peer) =>
      this._currentUser.startStreamingWithRemotePeer(peer)
    );
  }

  removeLocalUserMediaStream() {
    log("Removing local user media stream");
    this.localUser().removeMediaStream();

    this.allRemotePeers().forEach((peer) =>
      this._currentUser.stopStreamingWithRemotePeer(peer)
    );
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

  allRemotePeers(): RemotePeer[] {
    return Array.from(this._remotePeers);
  }

  static create(slug: string, currentUser: CurrentUser) {
    return new Conference(slug, currentUser);
  }
}
