import { User } from "./webrtc/types";
import { logMedia, logRtc } from "./webrtc/log";

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

    connection.addEventListener("track", ({ track }) => {
      logMedia(
        `📫 Received track event (${track.kind} / ${
          track.id
        }) from user ${this.id()} (${this.name()})`
      );

      const tracksToRemove =
        track.kind === "video"
          ? mediaStream.getVideoTracks()
          : mediaStream.getAudioTracks();
      tracksToRemove.forEach((trackToRemove) =>
        mediaStream.removeTrack(trackToRemove)
      );

      mediaStream.addTrack(track);
    });
  }

  is(peer: RemotePeer) {
    return this.id() === peer.id();
  }

  id() {
    return this.user.id;
  }

  name() {
    return this.user.name;
  }

  onIceCandidate(callback: IceCandidateCallback) {
    this.connection.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        return;
      }

      callback(e.candidate);
    });
  }

  onNegociationNeeded(callback: OfferCallback) {
    this.connection.addEventListener("negotiationneeded", async () => {
      logRtc(`⚠️ Negociation needed for user ${this.id()} (${this.name()})`);

      const offer = await this.connection.createOffer();
      await this.connection.setLocalDescription(offer);

      callback(offer);
    });
  }

  onConnected(callback: ConnectedCallback) {
    this.connection.addEventListener("signalingstatechange", () => {
      if (this.connection.signalingState === "stable") {
        logRtc(
          `✅ Connection established with remote user ${this.id()} (${this.name()})`
        );
        callback();
      }
    });
  }

  onDisconnected(callback: DisconnectedCallback) {
    this.connection.addEventListener("iceconnectionstatechange", () => {
      if (this.connection.iceConnectionState === "disconnected") {
        logRtc(
          `❌ Connection closed with remote user ${this.id()} (${this.name()})`
        );
        callback();
      }
    });
  }

  sendLocalStream(localMediaStream: MediaStream) {
    const existingTracks = this.connection
      .getSenders()
      .map((sender) => sender.track)
      .filter(Boolean)
      .map((track) => track!.id);

    localMediaStream.getTracks().forEach((track) => {
      if (!existingTracks.includes(track.id)) {
        logRtc(
          `🛫 Sending a remote track to user ${this.id()} (${this.name()})`
        );
        this.connection.addTrack(track, localMediaStream);
      }
    });
  }

  removeLocalStream() {
    this.connection.getSenders().forEach((sender) => {
      logRtc(`🛫 Removing track from user ${this.id()} (${this.name()})`);
      this.connection.removeTrack(sender);
    });
  }

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
    logRtc(
      `🏗 Setting the remote description for user ${this.id()} (${this.name()})`
    );
    return this.connection.setRemoteDescription(sessionDescription);
  }

  addIceCandidate(iceCandidate: RTCIceCandidateInit) {
    logRtc(
      `🏗 Setting an ice candidate for remote user ${this.id()} (${this.name()})`
    );
    return this.connection.addIceCandidate(iceCandidate);
  }

  isSharingAudio() {
    const audioTracks = this.mediaStream?.getAudioTracks() || [];

    return audioTracks.length > 0;
  }

  isSharingVideo() {
    const videoTracks = this.mediaStream?.getVideoTracks() || [];

    return videoTracks.length > 0;
  }

  static create(user: User) {
    logRtc(
      `🏗 Creating a peer connection for remote user ${user.id} (${user.name})`
    );

    const connection = new RTCPeerConnection(peerConnectionConfiguration);
    const mediaStream = new MediaStream();

    return new RemotePeer(user, connection, mediaStream);
  }

  debugRtc() {
    this.connection.addEventListener("icecandidateerror", (e) => {
      logRtc(
        `Ice candidate error (user ${this.id()}, ${this.name()}):`,
        this.connection.iceConnectionState
      );
    });

    this.connection.addEventListener("icegatheringstatechange", () => {
      logRtc(
        `Ice gathering state changed (user ${this.id()}, ${this.name()}):`,
        this.connection.iceGatheringState
      );
    });

    this.connection.addEventListener("connectionstatechange", () => {
      logRtc(
        `Connection state changed (user ${this.id()}, ${this.name()}):`,
        this.connection.connectionState
      );
    });

    this.connection.addEventListener("signalingstatechange", () => {
      logRtc(
        `Signaling state changed (user ${this.id()}, ${this.name()}):`,
        this.connection.signalingState
      );
    });

    this.connection.addEventListener("negotiationneeded", () => {
      logRtc(
        `Negotiation needed (user ${this.id()}, ${this.name()}):`,
        this.connection.connectionState
      );
    });
  }
}
