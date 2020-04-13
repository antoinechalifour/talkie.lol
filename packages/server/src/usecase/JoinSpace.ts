import debug from "debug";

import { User } from "../domain/entities/User";
import { SpacePort } from "./ports/SpacePort";
import { NotificationPort } from "./ports/NotificationPort";

interface Dependencies {
  spacePort: SpacePort;
  notificationPort: NotificationPort;
  currentUser: User;
}

const log = debug("app:usecase:JoinSpace");

export class JoinSpace {
  private readonly spacePort: SpacePort;
  private readonly notificationPort: NotificationPort;
  private readonly currentUser: User;

  constructor({ spacePort, notificationPort, currentUser }: Dependencies) {
    this.spacePort = spacePort;
    this.notificationPort = notificationPort;
    this.currentUser = currentUser;
  }

  async execute() {
    log("execute");

    const space = await this.spacePort.findSpaceById(this.currentUser.spaceId);

    this.notificationPort.notifySpaceJoined(space, this.currentUser);

    log(`User ${this.currentUser.id.get()} has joined ${space.id.get()}`);
  }
}
