import { Author, Message } from "../models/Message";

type OnMessage = (message: Message) => void;

export class MessageChunkBuilder {
  private state: string;
  private messageBuilder: string;
  private currentMessageType: string | null;
  private numberOfIncomingChunk: number | null;

  constructor(private author: Author, private onMessage: OnMessage) {
    this.state = "idle";
    this.messageBuilder = "";
    this.currentMessageType = null;
    this.numberOfIncomingChunk = null;
  }

  read(chunk: string) {
    if (this.state === "idle") {
      this._startMessage(chunk);
    } else if (this._hasMoreIncomingChunks()) {
      this._addChunk(chunk);
    }
  }

  private _hasMoreIncomingChunks() {
    return (
      this.numberOfIncomingChunk !== null && this.numberOfIncomingChunk > 0
    );
  }

  private _startMessage(chunk: string) {
    let numberOfIncomingChunk: string;
    [, this.currentMessageType, numberOfIncomingChunk] = chunk.split(":");

    this.state = "reading";
    this.numberOfIncomingChunk = Number(numberOfIncomingChunk);
  }

  private _reset() {
    this.state = "idle";
    this.messageBuilder = "";
    this.currentMessageType = null;
    this.numberOfIncomingChunk = null;
  }

  private _addChunk(chunk: string) {
    if (this.numberOfIncomingChunk === null) return;

    this.messageBuilder += chunk;
    this.numberOfIncomingChunk -= 1;

    if (this.numberOfIncomingChunk === 0) {
      const message =
        this.currentMessageType === "image"
          ? Message.createImageMessage(this.author, this.messageBuilder)
          : Message.createTextMessage(this.author, this.messageBuilder);

      this.onMessage(message);
      this._reset();
    }
  }
}
