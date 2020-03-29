import debug from "debug";

import { Space } from "../domain/entities/Space";
import { SpacePort } from "./ports/SpacePort";

interface Dependencies {
  spacePort: SpacePort;
}

const log = debug("app:usecase:CreateSpace");

export class CreateSpace {
  private readonly spacePort: SpacePort;

  constructor({ spacePort }: Dependencies) {
    this.spacePort = spacePort;
  }

  async execute() {
    log("execute");

    const space = Space.createSpace();

    await this.spacePort.saveSpace(space);

    log(`Space ${space.id.get()} has been created`);

    return space;
  }
}
