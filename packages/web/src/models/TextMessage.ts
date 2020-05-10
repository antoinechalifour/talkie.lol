import { v4 as uuid } from "uuid";

import { Author, Message } from "./Message";

export class TextMessage extends Message {
  private constructor(
    id: string,
    author: Author,
    receivedAt: Date,
    private _content: string
  ) {
    super(id, author, receivedAt);
  }

  content() {
    return this._content;
  }

  static createTextMessage(author: Author, content: string) {
    return new TextMessage(uuid(), author, new Date(), content);
  }
}
