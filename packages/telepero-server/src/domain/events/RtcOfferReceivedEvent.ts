import { User } from "../entities/User";
import { UserId } from "../entities/UserId";
import { SessionDescription } from "../entities/SessionDescription";
import { RtcEvent } from "./RtcEvent";

export class RtcOfferReceivedEvent extends RtcEvent {
  static TYPE = "RTC_OFFER_RECEIVED";

  private constructor(
    public offer: SessionDescription,
    senderId: UserId,
    recipientId: UserId,
    date: Date
  ) {
    super(RtcOfferReceivedEvent.TYPE, senderId, recipientId, date);
  }

  static create(offer: SessionDescription, sender: User, recipient: User) {
    return new RtcOfferReceivedEvent(
      offer,
      sender.id,
      recipient.id,
      new Date()
    );
  }
}
