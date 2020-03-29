import { UserId } from "../entities/UserId";
import { Event } from "./Event";

export abstract class RtcEvent extends Event {
  constructor(
    type: string,
    public senderId: UserId,
    public recipientId: UserId,
    date: Date
  ) {
    super(type, date);
  }

  format() {
    return `[${this.type}] ${this.senderId.get()} -> ${this.recipientId.get()}`;
  }
}
