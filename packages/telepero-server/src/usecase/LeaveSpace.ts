import debug from "debug";

import { User } from "../domain/entities/User";
import { SpacePort } from "./ports/SpacePort";
import { NotificationPort } from "./ports/NotificationPort";

interface Dependencies {
  spacePort: SpacePort;
  notificationPort: NotificationPort;
  currentUser: User;
}

const log = debug("app:usecase:LeaveSpace");

export class LeaveSpace {
  private readonly spacePort: SpacePort;
  private readonly notificationPort: NotificationPort;
  private readonly currentUser: User;

  constructor({ spacePort, notificationPort, currentUser }: Dependencies) {
    this.spacePort = spacePort;
    this.notificationPort = notificationPort;
    this.currentUser = currentUser;
  }

  async execute(slug: string) {
    log("execute");

    const space = await this.spacePort.findSpaceBySlug(slug);

    this.notificationPort.notifySpaceLeft(space, this.currentUser);

    log(`User ${this.currentUser.id.get()} has left space ${space.id.get()}`);

    return this.currentUser;
  }
}
