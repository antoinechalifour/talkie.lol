import { v4 as uuid } from "uuid";
import format from "date-fns/format";

export interface Author {
  id: string;
  name: string;
}

export type MessageType = "text" | "image";

export class Message {
  private constructor(
    private _id: string,
    private _type: MessageType,
    private _author: Author,
    private _content: string,
    private _receivedAt: Date
  ) {}

  id() {
    return this._id;
  }

  author() {
    return this._author;
  }

  content() {
    return this._content;
  }

  type() {
    return this._type;
  }

  receivedTime() {
    return format(this._receivedAt, "HH:mm");
  }

  isImage() {
    return this._type === "image";
  }

  static createTextMessage(author: Author, content: string) {
    return new Message(uuid(), "text", author, content, new Date());
  }

  static createImageMessage(author: Author, content: string) {
    return new Message(uuid(), "image", author, content, new Date());
  }
}
