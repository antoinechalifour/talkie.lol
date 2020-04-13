import debug from "debug";

import { User } from "../domain/entities/User";
import { UserId } from "../domain/entities/UserId";
import { NotificationPort } from "./ports/NotificationPort";
import { UserPort } from "./ports/UserPort";
import { SessionDescription } from "../domain/entities/SessionDescription";

interface Dependencies {
  notificationPort: NotificationPort;
  userPort: UserPort;
  currentUser: User;
}

const log = debug("app:usecase:SendRtcAnswer");

export class SendRtcAnswer {
  private readonly notificationPort: NotificationPort;
  private readonly userPort: UserPort;
  private readonly currentUser: User;

  constructor({ notificationPort, userPort, currentUser }: Dependencies) {
    this.notificationPort = notificationPort;
    this.userPort = userPort;
    this.currentUser = currentUser;
  }

  async execute(answer: string, recipientId: string): Promise<void> {
    log("execute");

    const recipient = await this.userPort.findUserById(
      UserId.fromString(recipientId)
    );
    const sessionDescription = SessionDescription.answer(answer);

    this.notificationPort.notifyRtcAnswerReceived(
      sessionDescription,
      this.currentUser,
      recipient
    );

    log(
      `User ${this.currentUser.id.get()} has sent an answer to ${recipient.id.get()}`
    );
  }
}
