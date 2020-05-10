import debug from "debug";

import { splitStringToChunks } from "../utils/chunks";
import { MessageChunkBuilder } from "../services/MessageChunkBuilder";
import { RemoteUser } from "./RemoteUser";
import { User } from "./User";
import { Message } from "./Message";
import { TextMessage } from "./TextMessage";
import { ImageMessage } from "./ImageMessage";
import { FilePreview, FilePreviewMessage } from "./FilePreviewMessage";
import { ChunkFileReader } from "../services/ChunkFileReader";

const log = debug("app:RemotePeer");

type IceCandidateCallback = (iceCandidate: RTCIceCandidate) => void;
type OfferCallback = (offer: RTCSessionDescriptionInit) => void;
type ConnectedCallback = () => void;
type DisconnectedCallback = () => void;
type MessageCallback = (message: Message) => void;
type GetFileCallback = (fileId: string) => File;

interface RemotePeerOptions {
  rtcConfiguration: RTCConfiguration;
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onNegociationNeeded: (offer: RTCSessionDescriptionInit) => void;
  onDisconnected: () => void;
  onMessage: MessageCallback;
  getFile: (fileId: string) => File;
}

export class RemotePeer implements User {
  public isConnected: boolean;
  private _availableFilesInfo: Set<FilePreview> = new Set();

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

    let type: string;
    let content: string;

    if (message instanceof TextMessage) {
      type = "text";
      content = message.content();
    } else if (message instanceof ImageMessage) {
      type = "image";
      content = message.source();
    } else if (message instanceof FilePreviewMessage) {
      type = "filepreview";
      content = JSON.stringify(message.preview());
    } else {
      throw new Error("Invalid message type");
    }

    const chunks = splitStringToChunks(content, 8000);
    const numberOfChunks = chunks.length;
    const header = `start:${type}:${numberOfChunks}`;

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

  requestFile(fileId: string) {
    const filePreview = this._getFilePreviewById(fileId);
    const fileDataChannel = this._connection.createDataChannel(
      `download/${filePreview.fileId}`
    );

    console.log(filePreview);

    // TODO: not tested
    const buffer: ArrayBuffer[] = [];
    let bufferSize = 0;
    fileDataChannel.addEventListener("message", (e) => {
      const chunk = e.data as ArrayBuffer;

      buffer.push(chunk);
      bufferSize += chunk.byteLength;

      if (bufferSize >= filePreview.size) {
        console.log("Downloading file...");
        fileDataChannel.close();
        const blob = new Blob(buffer);

        const link = document.createElement("a");
        link.download = filePreview.fileName;
        link.href = URL.createObjectURL(blob);

        link.click();
      }
    });
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
      ._onDownloadDataChannel(options.getFile)
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
      ._onChatDataChannel(options.onMessage)
      ._onDownloadDataChannel(options.getFile)
      ._debugRtc();

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

  private _onChatDataChannel(onMessage: MessageCallback) {
    this._connection.addEventListener("datachannel", (e) => {
      if (e.channel.label !== "chat") return;

      log(`♻️ Data Channel | ${e.channel.label}`);
      this._addDataChannel(e.channel);
      this._onMessage(onMessage);
    });

    return this;
  }

  // TODO: not tested
  private _onDownloadDataChannel(getFile: GetFileCallback) {
    this._connection.addEventListener("datachannel", (e) => {
      const channel = e.channel;

      if (!channel.label.startsWith("download/")) return;

      const [, fileId] = channel.label.split("/");
      const file = getFile(fileId);
      const chunkFileReader = new ChunkFileReader(file, 8000);

      chunkFileReader.onChunk((chunk) => {
        console.log("Sending chunk");
        channel.send(chunk);
      });
      chunkFileReader.read();
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

    // TODO: extract callback to a method
    const messageChunkBuilder = new MessageChunkBuilder(author, (message) => {
      // TODO: not tested
      if (message instanceof FilePreviewMessage) {
        this._availableFilesInfo.add(message.preview());
      }

      onMessage(message);
    });

    dataChannel.addEventListener("message", (e) =>
      messageChunkBuilder.read(e.data)
    );

    return this;
  }

  private _getFilePreviewById(fileId: string) {
    for (const filePreview of Array.from(this._availableFilesInfo)) {
      if (filePreview.fileId === fileId) return filePreview;
    }

    throw new Error(`File preview ${fileId} was not found`);
  }
}
