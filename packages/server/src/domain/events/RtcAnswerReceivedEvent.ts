import { User } from "../entities/User";
import { SessionDescription } from "../entities/SessionDescription";
import { RtcEvent } from "./RtcEvent";

export class RtcAnswerReceivedEvent extends RtcEvent {
  static TYPE = "RTC_ANSWER_RECEIVED";

  private constructor(
    public answer: SessionDescription,
    senderId: string,
    recipientId: string,
    date: Date
  ) {
    super(RtcAnswerReceivedEvent.TYPE, senderId, recipientId, date);
  }

  static create(answer: SessionDescription, sender: User, recipient: User) {
    return new RtcAnswerReceivedEvent(
      answer,
      sender.id.get(),
      recipient.id.get(),
      new Date()
    );
  }
}
