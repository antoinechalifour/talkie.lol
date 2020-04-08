import { SpaceId } from "../entities/SpaceId";
import { Event } from "./Event";
import { UserId } from "../entities/UserId";
import { User } from "../entities/User";
import { Space } from "../entities/Space";

export class SpaceJoinedEvent extends Event {
  static TYPE = "SPACE_JOINED";

  private constructor(
    public spaceId: string,
    public userId: string,
    date: Date
  ) {
    super(SpaceJoinedEvent.TYPE, date);
  }

  format() {
    return `[${this.type}] ${this.userId} / ${this.spaceId}`;
  }

  static create(space: Space, user: User) {
    return new SpaceJoinedEvent(space.id.get(), user.id.get(), new Date());
  }
}
