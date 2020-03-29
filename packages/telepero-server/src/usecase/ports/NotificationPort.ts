import { Space } from "../../domain/entities/Space";
import { User } from "../../domain/entities/User";
import { SessionDescription } from "../../domain/entities/SessionDescription";

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
    iceCandidate: string,
    sender: User,
    recipient: User
  ): void;
}
