import debug from "debug";

import { UserId } from "../domain/entities/UserId";
import { User } from "../domain/entities/User";
import { NotificationPort } from "./ports/NotificationPort";
import { UserPort } from "./ports/UserPort";
import { SessionDescription } from "../domain/entities/SessionDescription";

interface Dependencies {
  notificationPort: NotificationPort;
  userPort: UserPort;
  currentUser: User;
}

const log = debug("app:usecase:SendRtcOffer");

export class SendRtcOffer {
  private readonly notificationPort: NotificationPort;
  private readonly userPort: UserPort;
  private readonly currentUser: User;

  constructor({ notificationPort, userPort, currentUser }: Dependencies) {
    this.notificationPort = notificationPort;
    this.userPort = userPort;
    this.currentUser = currentUser;
  }

  async execute(offer: string, recipientId: string): Promise<void> {
    log("execute");

    const recipient = await this.userPort.findUserById(
      UserId.fromString(recipientId)
    );
    const sessionDescription = SessionDescription.offer(offer);

    this.notificationPort.notifyRtcOfferReceived(
      sessionDescription,
      this.currentUser,
      recipient
    );

    log(
      `User ${this.currentUser.id.get()} has sent an offer to ${recipient.id.get()}`
    );
  }
}
