import { UserId } from "./UserId";
import { SpaceId } from "./SpaceId";

export class Session {
  private constructor(
    public token: string,
    public userId: UserId,
    public spaceId: SpaceId
  ) {}

  static create(token: string, userId: UserId, spaceId: SpaceId): Session {
    return new Session(token, userId, spaceId);
  }
}
