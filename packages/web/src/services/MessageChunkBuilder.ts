import { Author, Message } from "../models/Message";
import { ImageMessage } from "../models/ImageMessage";
import { TextMessage } from "../models/TextMessage";
import { FilePreviewMessage, FilePreview } from "../models/FilePreviewMessage";

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

    if (this.numberOfIncomingChunk !== 0) return;

    this._buildMessage();
  }

  private _buildMessage() {
    let message: Message;

    switch (this.currentMessageType) {
      case "image":
        message = ImageMessage.createImageMessage(
          this.author,
          this.messageBuilder
        );
        break;

      case "text":
        message = TextMessage.createTextMessage(
          this.author,
          this.messageBuilder
        );
        break;

      case "filepreview":
        const preview: FilePreview = JSON.parse(this.messageBuilder);
        message = FilePreviewMessage.createFilePreviewMessage(
          this.author,
          preview
        );
        break;

      default:
        throw new Error(`Invalid message type: ${this.currentMessageType}`);
    }

    this.onMessage(message);
    this._reset();
  }
}
