import debug from "debug";

import { splitStringToChunks } from "../utils/chunks";
import { RemoteUser } from "./RemoteUser";
import { User } from "./User";
import { Message } from "./Message";
import { MessageChunkBuilder } from "../services/MessageChunkBuilder";

const log = debug("app:RemotePeer");

type IceCandidateCallback = (iceCandidate: RTCIceCandidate) => void;
type OfferCallback = (offer: RTCSessionDescriptionInit) => void;
type ConnectedCallback = () => void;
type DisconnectedCallback = () => void;
type MessageCallback = (message: Message) => void;

interface RemotePeerOptions {
  rtcConfiguration: RTCConfiguration;
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onNegociationNeeded: (offer: RTCSessionDescriptionInit) => void;
  onDisconnected: () => void;
  onMessage: MessageCallback;
}

export class RemotePeer implements User {
  public isConnected: boolean;

  constructor(
    private _user: RemoteUser,
    private _connection: RTCPeerConnection,
    private _mediaStream: MediaStream,
    private _dataChannel: RTCDataChannel | null
  ) {
    this.isConnected = false;

    this._onConnected(() => (this.isConnected = true));
    this._onDisconnected(() => (this.isConnected = false));

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

  mediaStream() {
    return this._mediaStream;
  }

  dataChannel() {
    return this._dataChannel;
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

  sendMessage(message: Message) {
    const dataChannel = this.dataChannel();

    if (!dataChannel) return;

    const chunks = splitStringToChunks(message.content(), 8000);
    const numberOfChunks = chunks.length;
    const header = `start:${message.type()}:${numberOfChunks}`;

    dataChannel.send(header);

    chunks.forEach((chunk) => dataChannel.send(chunk));
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

  closeConnection() {
    this.stopStreaming();

    // @ts-ignore
    this._connection = null;
  }

  static createOfferer(user: RemoteUser, options: RemotePeerOptions) {
    const connection = new RTCPeerConnection(options.rtcConfiguration);
    const mediaStream = new MediaStream();
    const dataChannel = connection.createDataChannel("chat");

    return new RemotePeer(user, connection, mediaStream, dataChannel)
      ._onIceCandidate(options.onIceCandidate)
      ._onNegotiationNeeded(options.onNegociationNeeded)
      ._onDisconnected(options.onDisconnected)
      ._onMessage(options.onMessage)
      ._debugRtc()
      ._debugDataChannel();
  }

  static createAnswerer(user: RemoteUser, options: RemotePeerOptions) {
    const connection = new RTCPeerConnection(options.rtcConfiguration);
    const mediaStream = new MediaStream();

    const remotePeer = new RemotePeer(user, connection, mediaStream, null)
      ._onIceCandidate(options.onIceCandidate)
      ._onNegotiationNeeded(options.onNegociationNeeded)
      ._onDisconnected(options.onDisconnected)
      ._debugRtc();

    connection.addEventListener("datachannel", (e) => {
      log(`♻️ Data Channel | ${e.channel.label}`);
      remotePeer._addDataChannel(e.channel);
      remotePeer._onMessage(options.onMessage);
    });

    return remotePeer;
  }

  /* istanbul ignore next */
  private _debugRtc() {
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

  /* istanbul ignore next */
  private _debugDataChannel() {
    if (!this._dataChannel) return this;

    this._dataChannel.addEventListener("open", () => {
      log(`♻️ Data channel is now open for user ${this.id()} (${this.name()})`);
    });

    this._dataChannel.addEventListener("close", () => {
      log(
        `♻️ Data channel is now closed for user ${this.id()} (${this.name()})`
      );
    });

    this._dataChannel.addEventListener("error", (e) => {
      log(`🛑 Data channel error for user ${this.id()} (${this.name()}):`, e);
    });

    this._dataChannel.addEventListener("message", (e) => {
      log(
        `♻️ Data channel message from user ${this.id()} (${this.name()}):`,
        e
      );
    });

    return this;
  }

  private _listenForTracks() {
    this._connection.addEventListener("track", ({ track }) => {
      for (const oldTrack of this.mediaStream().getTracks()) {
        if (oldTrack.kind !== track.kind) continue;

        const event = new MediaStreamTrackEvent("removetrack", {
          track: oldTrack,
        });

        this.mediaStream().removeTrack(oldTrack);
        this.mediaStream().dispatchEvent(event);
      }

      const event = new MediaStreamTrackEvent("addtrack", { track });

      this.mediaStream().addTrack(track);
      this.mediaStream().dispatchEvent(event);
    });
  }

  private _addDataChannel(dataChannel: RTCDataChannel) {
    this._dataChannel = dataChannel;

    this._debugDataChannel();
  }

  private _onIceCandidate(callback: IceCandidateCallback) {
    this._connection.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        return;
      }

      callback(e.candidate);
    });

    return this;
  }

  private _onNegotiationNeeded(callback: OfferCallback) {
    this._connection.addEventListener("negotiationneeded", async () => {
      const offer = await this._connection.createOffer();

      if (this._connection.signalingState !== "stable") return;

      await this._connection.setLocalDescription(offer);

      callback(offer);
    });

    return this;
  }

  private _onConnected(callback: ConnectedCallback) {
    this._connection.addEventListener("signalingstatechange", () => {
      if (this._connection.signalingState === "stable") {
        callback();
      }
    });

    return this;
  }

  private _onDisconnected(callback: DisconnectedCallback) {
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

  private _onMessage(onMessage: MessageCallback) {
    const dataChannel = this.dataChannel();

    if (!dataChannel) return this;

    const author = {
      id: this.id(),
      name: this.name(),
    };
    const messageChunkBuilder = new MessageChunkBuilder(author, onMessage);

    dataChannel.addEventListener("message", (e) =>
      messageChunkBuilder.read(e.data)
    );

    return this;
  }
}
