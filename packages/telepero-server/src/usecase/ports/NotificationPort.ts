import { Space } from "../../domain/entities/Space";
import { User } from "../../domain/entities/User";
import { SessionDescription } from "../../domain/entities/SessionDescription";
import { IceCandidate } from "../../domain/entities/IceCandidate";

export interface NotificationPort {
  notifySpaceJoined(space: Space, user: User): void;
  notifySpaceLeft(space: Space, user: User): void;
  notifyRtcOfferReceived(
    offer: SessionDescription,
    sender: User,
    recipient: User
  ): void;
  notifyRtcAnswerReceived(
    answer: SessionDescription,
    sender: User,
    recipient: User
  ): void;
  notifyRtcIceCandidateReceived(
    iceCandidate: IceCandidate,
    sender: User,
    recipient: User
  ): void;
}
