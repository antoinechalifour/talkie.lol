import { withFilter, PubSub } from "apollo-server-koa";
import debug from "debug";

import { Space } from "../../../domain/entities/Space";
import { SpaceLeftEvent } from "../../../domain/events/SpaceLeftEvent";
import { User } from "../../../domain/entities/User";
import { SpacePort } from "../../../usecase/ports/SpacePort";
import { UserPort } from "../../../usecase/ports/UserPort";
import { SubscriptionResolver } from "./types";

interface Dependencies {
  pubSub: PubSub;
  spacePort: SpacePort;
  userPort: UserPort;
}

interface SpaceLeftResult {
  space: Space;
  user: User;
}

interface SpaceLeftArguments {
  slug: string;
}

const log = debug("app:resolver:SpaceLeftResolver");

export class SpaceLeftResolver
  implements
    SubscriptionResolver<SpaceLeftEvent, SpaceLeftArguments, SpaceLeftResult> {
  private readonly pubSub: PubSub;
  private readonly spacePort: SpacePort;
  private readonly userPort: UserPort;

  constructor({ pubSub, spacePort, userPort }: Dependencies) {
    this.pubSub = pubSub;
    this.spacePort = spacePort;
    this.userPort = userPort;
  }

  subscribe = withFilter(
    () => this.pubSub.asyncIterator([SpaceLeftEvent.TYPE]),
    async (event: SpaceLeftEvent, args: SpaceLeftArguments) => {
      const space = await this.spacePort.findSpaceById(event.spaceId);

      return space.compareBySlug(args.slug);
    }
  );

  async resolve(event: SpaceLeftEvent) {
    log("resolve");

    const [space, user] = await Promise.all([
      this.spacePort.findSpaceById(event.spaceId),
      this.userPort.findUserById(event.userId),
    ]);

    return { space, user };
  }
}
