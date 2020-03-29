import { SpaceId } from "../entities/SpaceId";
import { Event } from "./Event";
import { UserId } from "../entities/UserId";
import { User } from "../entities/User";
import { Space } from "../entities/Space";

export class SpaceJoinedEvent extends Event {
  static TYPE = "SPACE_JOINED";

  private constructor(
    public spaceId: SpaceId,
    public userId: UserId,
    date: Date
  ) {
    super(SpaceJoinedEvent.TYPE, date);
  }

  format() {
    return `[${this.type}] ${this.userId.get()} / ${this.spaceId.get()}`;
  }

  static create(space: Space, user: User) {
    return new SpaceJoinedEvent(space.id, user.id, new Date());
  }
}
