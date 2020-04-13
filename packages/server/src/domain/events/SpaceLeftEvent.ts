import { User } from "../entities/User";
import { Space } from "../entities/Space";
import { Event } from "./Event";

export class SpaceLeftEvent extends Event {
  static TYPE = "SPACE_LEFT_EVENT";

  private constructor(
    public spaceId: string,
    public userId: string,
    date: Date
  ) {
    super(SpaceLeftEvent.TYPE, date);
  }

  format(): string {
    return `[${this.type}] ${this.userId} / ${this.spaceId}`;
  }

  static create(space: Space, user: User): SpaceLeftEvent {
    return new SpaceLeftEvent(space.id.get(), user.id.get(), new Date());
  }
}
