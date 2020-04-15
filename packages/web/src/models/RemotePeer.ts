import debug from "debug";

import { RemoteUser } from "./RemoteUser";

const log = debug("app:RemotePeer");

type IceCandidateCallback = (iceCandidate: RTCIceCandidate) => void;
type OfferCallback = (offer: RTCSessionDescriptionInit) => void;
type ConnectedCallback = () => void;
type DisconnectedCallback = () => void;

interface RemotePeerOptions {
  rtcConfiguration: RTCConfiguration;
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onNegociationNeeded: (offer: RTCSessionDescriptionInit) => void;
  onDisconnected: () => void;
}

export class RemotePeer {
  public isConnected: boolean;

  constructor(
    private _user: RemoteUser,
    private _connection: RTCPeerConnection,
    public mediaStream: MediaStream
  ) {
    this.isConnected = false;

    this.onConnected(() => (this.isConnected = true));
    this.onDisconnected(() => (this.isConnected = false));

    this._listenForTracks();
  }

  is(peer: RemotePeer | null) {
    return !!peer && this.id() === peer.id();
  }

  isUser(user: RemoteUser) {
    return this._user.is(user);
  }

  id() {
    return this._user.id();
  }

  name() {
    return this._user.name();
  }

  // -------------------------------------------------- //
  // Media stuff
  // -------------------------------------------------- //

  startStreaming(mediaStream: MediaStream) {
    const existingTracks = this._connection
      .getSenders()
      .map((sender) => sender.track)
      .filter(Boolean)
      .map((track) => track!.id);

    mediaStream.getTracks().forEach((track) => {
      if (!existingTracks.includes(track.id)) {
        log(`[OUT] Track | ${this.name()} ${this.id()}`);
        this._connection.addTrack(track, mediaStream);
      }
    });
  }

  stopStreaming() {
    this._connection.getSenders().forEach((sender) => {
      log(`[OUT] Track | ${this.name()} ${this.id()}`);
      this._connection.removeTrack(sender);
    });
  }

  isSharingAudio() {
    const audioTracks = this.mediaStream?.getAudioTracks() || [];

    return audioTracks.length > 0;
  }

  isSharingVideo() {
    const videoTracks = this.mediaStream?.getVideoTracks() || [];

    return videoTracks.length > 0;
  }

  // -------------------------------------------------- //
  // WebRTC stuff
  // -------------------------------------------------- //

  createOffer() {
    return this._connection.createOffer();
  }

  createAnswer() {
    return this._connection.createAnswer();
  }

  setLocalDescription(sessionDescription: RTCSessionDescriptionInit) {
    return this._connection.setLocalDescription(sessionDescription);
  }

  setRemoteDescription(sessionDescription: RTCSessionDescriptionInit) {
    return this._connection.setRemoteDescription(sessionDescription);
  }

  addIceCandidate(iceCandidate: RTCIceCandidateInit) {
    return this._connection.addIceCandidate(iceCandidate);
  }

  onIceCandidate(callback: IceCandidateCallback) {
    this._connection.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        return;
      }

      callback(e.candidate);
    });

    return this;
  }

  onNegociationNeeded(callback: OfferCallback) {
    this._connection.addEventListener("negotiationneeded", async () => {
      const offer = await this._connection.createOffer();
      await this._connection.setLocalDescription(offer);

      callback(offer);
    });

    return this;
  }

  onConnected(callback: ConnectedCallback) {
    this._connection.addEventListener("signalingstatechange", () => {
      if (this._connection.signalingState === "stable") {
        callback();
      }
    });

    return this;
  }

  onDisconnected(callback: DisconnectedCallback) {
    this._connection.addEventListener("iceconnectionstatechange", () => {
      if (this._connection.iceConnectionState === "disconnected") {
        callback();
      }
    });
    this._connection.addEventListener("connectionstatechange", () => {
      if (this._connection.connectionState === "closed") {
        callback();
      }
    });

    return this;
  }

  static create(user: RemoteUser, options: RemotePeerOptions) {
    const connection = new RTCPeerConnection(options.rtcConfiguration);
    const mediaStream = new MediaStream();

    return new RemotePeer(user, connection, mediaStream)
      .onIceCandidate(options.onIceCandidate)
      .onNegociationNeeded(options.onNegociationNeeded)
      .onDisconnected(options.onDisconnected)
      .debugRtc();
  }

  private debugRtc() {
    this._connection.addEventListener("icecandidateerror", (e) => {
      log(
        `🛑 Ice candidate error (user ${this.id()}, ${this.name()}):`,
        this._connection.iceConnectionState
      );
    });

    this._connection.addEventListener("icegatheringstatechange", () => {
      log(
        `♻️ Ice gathering state changed (user ${this.id()}, ${this.name()}):`,
        this._connection.iceGatheringState
      );
    });

    this._connection.addEventListener("connectionstatechange", () => {
      log(
        `️️♻️ Connection state changed (user ${this.id()}, ${this.name()}):`,
        this._connection.connectionState
      );
    });

    this._connection.addEventListener("signalingstatechange", () => {
      log(
        `♻️ Signaling state changed (user ${this.id()}, ${this.name()}):`,
        this._connection.signalingState
      );
    });

    this._connection.addEventListener("negotiationneeded", () => {
      log(
        `⚠️ Negotiation needed (user ${this.id()}, ${this.name()}):`,
        this._connection.connectionState
      );
    });

    this._connection.addEventListener("track", ({ track }) => {
      log(
        `[IN] Track | (${track.kind} / ${
          track.id
        }) from user ${this.id()} (${this.name()})`
      );
    });

    return this;
  }

  private _listenForTracks() {
    this._connection.addEventListener("track", ({ track }) => {
      const tracksToRemove =
        track.kind === "video"
          ? this.mediaStream.getVideoTracks()
          : this.mediaStream.getAudioTracks();
      tracksToRemove.forEach((trackToRemove) =>
        this.mediaStream.removeTrack(trackToRemove)
      );

      this.mediaStream.addTrack(track);
    });
  }
}
