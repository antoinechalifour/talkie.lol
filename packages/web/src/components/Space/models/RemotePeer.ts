import { User } from "../webrtc/types";
import { logRtc } from "../webrtc/log";

type IceCandidateCallback = (iceCandidate: RTCIceCandidate) => void;
type OfferCallback = (offer: RTCSessionDescriptionInit) => void;
type ConnectedCallback = () => void;
type DisconnectedCallback = () => void;

const peerConnectionConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
    {
      urls: ["stun:stun1.l.google.com:19302"],
    },
  ],
};

interface RemotePeerOptions {
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onNegociationNeeded: (offer: RTCSessionDescriptionInit) => void;
  onConnected: () => void;
  onDisconnected: () => void;
}

export class RemotePeer {
  public isConnected: boolean;

  constructor(
    public user: User,
    private connection: RTCPeerConnection,
    public mediaStream: MediaStream
  ) {
    this.isConnected = false;

    this.onConnected(() => (this.isConnected = true));
    this.onDisconnected(() => (this.isConnected = false));

    this._listenForTracks();
  }

  is(peer: RemotePeer) {
    return this.id() === peer.id();
  }

  isUser(user: User) {
    return this.user.id === user.id;
  }

  id() {
    return this.user.id;
  }

  name() {
    return this.user.name;
  }

  // -------------------------------------------------- //
  // Media stuff
  // -------------------------------------------------- //

  startStreaming(mediaStream: MediaStream) {
    const existingTracks = this.connection
      .getSenders()
      .map((sender) => sender.track)
      .filter(Boolean)
      .map((track) => track!.id);

    mediaStream.getTracks().forEach((track) => {
      if (!existingTracks.includes(track.id)) {
        logRtc(`[OUT] Track | ${this.name()} ${this.id()}`);
        this.connection.addTrack(track, mediaStream);
      }
    });
  }

  stopStreaming() {
    this.connection.getSenders().forEach((sender) => {
      logRtc(`[OUT] Track | ${this.name()} ${this.id()}`);
      this.connection.removeTrack(sender);
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
    return this.connection.createOffer();
  }

  createAnswer() {
    return this.connection.createAnswer();
  }

  setLocalDescription(sessionDescription: RTCSessionDescriptionInit) {
    return this.connection.setLocalDescription(sessionDescription);
  }

  setRemoteDescription(sessionDescription: RTCSessionDescriptionInit) {
    return this.connection.setRemoteDescription(sessionDescription);
  }

  addIceCandidate(iceCandidate: RTCIceCandidateInit) {
    return this.connection.addIceCandidate(iceCandidate);
  }

  onIceCandidate(callback: IceCandidateCallback) {
    this.connection.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        return;
      }

      callback(e.candidate);
    });

    return this;
  }

  onNegociationNeeded(callback: OfferCallback) {
    this.connection.addEventListener("negotiationneeded", async () => {
      const offer = await this.connection.createOffer();
      await this.connection.setLocalDescription(offer);

      callback(offer);
    });

    return this;
  }

  onConnected(callback: ConnectedCallback) {
    this.connection.addEventListener("signalingstatechange", () => {
      if (this.connection.signalingState === "stable") {
        callback();
      }
    });

    return this;
  }

  onDisconnected(callback: DisconnectedCallback) {
    this.connection.addEventListener("iceconnectionstatechange", () => {
      if (this.connection.iceConnectionState === "disconnected") {
        callback();
      }
    });

    return this;
  }

  static create(user: User, options: RemotePeerOptions) {
    const connection = new RTCPeerConnection(peerConnectionConfiguration);
    const mediaStream = new MediaStream();

    return new RemotePeer(user, connection, mediaStream)
      .onIceCandidate(options.onIceCandidate)
      .onNegociationNeeded(options.onNegociationNeeded)
      .onConnected(options.onConnected)
      .onDisconnected(options.onDisconnected)
      .debugRtc();
  }

  private debugRtc() {
    this.connection.addEventListener("icecandidateerror", (e) => {
      logRtc(
        `🛑 Ice candidate error (user ${this.id()}, ${this.name()}):`,
        this.connection.iceConnectionState
      );
    });

    this.connection.addEventListener("icegatheringstatechange", () => {
      logRtc(
        `♻️ Ice gathering state changed (user ${this.id()}, ${this.name()}):`,
        this.connection.iceGatheringState
      );
    });

    this.connection.addEventListener("connectionstatechange", () => {
      logRtc(
        `️️♻️ Connection state changed (user ${this.id()}, ${this.name()}):`,
        this.connection.connectionState
      );
    });

    this.connection.addEventListener("signalingstatechange", () => {
      logRtc(
        `♻️ Signaling state changed (user ${this.id()}, ${this.name()}):`,
        this.connection.signalingState
      );
    });

    this.connection.addEventListener("negotiationneeded", () => {
      logRtc(
        `⚠️ Negotiation needed (user ${this.id()}, ${this.name()}):`,
        this.connection.connectionState
      );
    });

    this.connection.addEventListener("track", ({ track }) => {
      logRtc(
        `[IN] Track | (${track.kind} / ${
          track.id
        }) from user ${this.id()} (${this.name()})`
      );
    });

    return this;
  }

  private _listenForTracks() {
    this.connection.addEventListener("track", ({ track }) => {
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
