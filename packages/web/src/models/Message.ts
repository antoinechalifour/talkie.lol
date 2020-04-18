import { v4 as uuid } from "uuid";
import format from "date-fns/format";

export interface Author {
  name: string;
}

export class Message {
  private constructor(
    private _id: string,
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

  receivedTime() {
    return format(this._receivedAt, "HH:mm");
  }

  static create(author: Author, content: string) {
    return new Message(uuid(), author, content, new Date());
  }
}
