import format from "date-fns/format";

export interface Author {
  id: string;
  name: string;
}

export abstract class Message {
  protected constructor(
    private _id: string,
    private _author: Author,
    private _receivedAt: Date
  ) {}

  id() {
    return this._id;
  }

  author() {
    return this._author;
  }

  receivedTime() {
    return format(this._receivedAt, "HH:mm");
  }
}
