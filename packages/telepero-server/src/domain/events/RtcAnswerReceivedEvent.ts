import { UserId } from "../entities/UserId";
import { User } from "../entities/User";
import { SessionDescription } from "../entities/SessionDescription";
import { RtcEvent } from "./RtcEvent";

export class RtcAnswerReceivedEvent extends RtcEvent {
  static TYPE = "RTC_ANSWER_RECEIVED";

  private constructor(
    public answer: SessionDescription,
    senderId: UserId,
    recipientId: UserId,
    date: Date
  ) {
    super(RtcAnswerReceivedEvent.TYPE, senderId, recipientId, date);
  }

  static create(answer: SessionDescription, sender: User, recipient: User) {
    return new RtcAnswerReceivedEvent(
      answer,
      sender.id,
      recipient.id,
      new Date()
    );
  }
}
