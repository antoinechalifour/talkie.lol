import { User } from "../entities/User";
import { IceCandidate } from "../entities/IceCandidate";
import { RtcEvent } from "./RtcEvent";

export class RtcIceCandidateReceivedEvent extends RtcEvent {
  static TYPE = "RTC_ICE_CANDIDATE_RECEIVED";

  private constructor(
    public iceCandidate: IceCandidate,
    senderId: string,
    recipientId: string,
    date: Date
  ) {
    super(RtcIceCandidateReceivedEvent.TYPE, senderId, recipientId, date);
  }

  static create(
    iceCandidate: IceCandidate,
    sender: User,
    recipient: User
  ): RtcIceCandidateReceivedEvent {
    return new RtcIceCandidateReceivedEvent(
      iceCandidate,
      sender.id.get(),
      recipient.id.get(),
      new Date()
    );
  }
}
