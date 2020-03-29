import { SpaceId } from "./SpaceId";
import { UserId } from "./UserId";

export class Token {
  private constructor(public userId: UserId, public spaceId: SpaceId) {}

  static create(userId: UserId, spaceId: SpaceId) {
    return new Token(userId, spaceId);
  }
}
