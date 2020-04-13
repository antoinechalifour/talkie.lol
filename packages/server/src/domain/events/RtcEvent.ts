import { Event } from "./Event";

export abstract class RtcEvent extends Event {
  protected constructor(
    type: string,
    public senderId: string,
    public recipientId: string,
    date: Date
  ) {
    super(type, date);
  }

  format(): string {
    return `[${this.type}] ${this.senderId} -> ${this.recipientId}`;
  }
}
