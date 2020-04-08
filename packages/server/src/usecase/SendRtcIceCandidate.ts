import debug from "debug";

import { User } from "../domain/entities/User";
import { UserId } from "../domain/entities/UserId";
import { NotificationPort } from "./ports/NotificationPort";
import { UserPort } from "./ports/UserPort";
import { IceCandidate } from "../domain/entities/IceCandidate";

interface Dependencies {
  notificationPort: NotificationPort;
  userPort: UserPort;
  currentUser: User;
}

const log = debug("app:usecase:SendRtcIceCandidate");

export class SendRtcIceCandidate {
  private readonly notificationPort: NotificationPort;
  private readonly userPort: UserPort;
  private readonly currentUser: User;

  constructor({ notificationPort, userPort, currentUser }: Dependencies) {
    this.notificationPort = notificationPort;
    this.userPort = userPort;
    this.currentUser = currentUser;
  }

  async execute(
    candidate: string,
    sdpMid: string,
    sdpMLineIndex: number,
    recipientId: string
  ) {
    log("execute");

    const recipient = await this.userPort.findUserById(
      UserId.fromString(recipientId)
    );

    this.notificationPort.notifyRtcIceCandidateReceived(
      IceCandidate.create(candidate, sdpMid, sdpMLineIndex),
      this.currentUser,
      recipient
    );

    log(
      `User ${this.currentUser.id.get()} has sent an ice candidate to ${recipient.id.get()}`
    );
  }
}
