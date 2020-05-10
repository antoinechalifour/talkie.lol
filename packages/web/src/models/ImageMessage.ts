import { v4 as uuid } from "uuid";

import { Author, Message } from "./Message";

export class ImageMessage extends Message {
  private constructor(
    id: string,
    author: Author,
    receivedAt: Date,
    private _source: string
  ) {
    super(id, author, receivedAt);
  }

  source() {
    return this._source;
  }

  static createImageMessage(author: Author, source: string) {
    return new ImageMessage(uuid(), author, new Date(), source);
  }
}
