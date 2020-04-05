import { UserId } from "../entities/UserId";
import { User } from "../entities/User";
import { IceCandidate } from "../entities/IceCandidate";
import { RtcEvent } from "./RtcEvent";

export class RtcIceCandidateReceivedEvent extends RtcEvent {
  static TYPE = "RTC_ICE_CANDIDATE_RECEIVED";

  private constructor(
    public iceCandidate: IceCandidate,
    senderId: UserId,
    recipientId: UserId,
    date: Date
  ) {
    super(RtcIceCandidateReceivedEvent.TYPE, senderId, recipientId, date);
  }

  static create(iceCandidate: IceCandidate, sender: User, recipient: User) {
    return new RtcIceCandidateReceivedEvent(
      iceCandidate,
      sender.id,
      recipient.id,
      new Date()
    );
  }
}
