import { Event } from "./Event";

export abstract class RtcEvent extends Event {
  constructor(
    type: string,
    public senderId: string,
    public recipientId: string,
    date: Date
  ) {
    super(type, date);
  }

  format() {
    return `[${this.type}] ${this.senderId} -> ${this.recipientId}`;
  }
}
