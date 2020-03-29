import { withFilter, PubSub } from "apollo-server-koa";
import debug from "debug";

import { User } from "../../../domain/entities/User";
import { Space } from "../../../domain/entities/Space";
import { SpaceJoinedEvent } from "../../../domain/events/SpaceJoinedEvent";
import { SpacePort } from "../../../usecase/ports/SpacePort";
import { UserPort } from "../../../usecase/ports/UserPort";
import { SubscriptionResolver } from "./types";

interface Dependencies {
  pubSub: PubSub;
  userPort: UserPort;
  spacePort: SpacePort;
  currentUser: User;
}

interface SpaceJoinedResult {
  space: Space;
  user: User;
}

interface SpaceJoinedArguments {
  slug: string;
}

const log = debug("app:resolver:SpaceJoinedResolver");

export class SpaceJoinedResolver
  implements
    SubscriptionResolver<
      SpaceJoinedEvent,
      SpaceJoinedArguments,
      SpaceJoinedResult
    > {
  private readonly pubSub: PubSub;
  private readonly spacePort: SpacePort;
  private readonly userPort: UserPort;
  private readonly currentUser: User;

  constructor({ pubSub, spacePort, userPort, currentUser }: Dependencies) {
    this.pubSub = pubSub;
    this.spacePort = spacePort;
    this.userPort = userPort;
    this.currentUser = currentUser;
  }

  subscribe = withFilter(
    () => this.pubSub.asyncIterator([SpaceJoinedEvent.TYPE]),
    async (event: SpaceJoinedEvent, args: SpaceJoinedArguments) => {
      const space = await this.spacePort.findSpaceById(event.spaceId);

      return (
        space.compareBySlug(args.slug) &&
        !event.userId.equals(this.currentUser.id)
      );
    }
  );

  async resolve(event: SpaceJoinedEvent) {
    log("resolve");

    const [space, user] = await Promise.all([
      this.spacePort.findSpaceById(event.spaceId),
      this.userPort.findUserById(event.userId),
    ]);

    return { space, user };
  }
}
