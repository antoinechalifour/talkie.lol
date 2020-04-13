import { Redis } from "ioredis";

import { UserId } from "../domain/entities/UserId";
import { SpaceId } from "../domain/entities/SpaceId";
import { User } from "../domain/entities/User";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError";
import { UserPort } from "../usecase/ports/UserPort";

interface Dependencies {
  redis: Redis;
}

const toRedisUser = (user: User): string =>
  JSON.stringify({
    id: user.id.get(),
    name: user.name,
    spaceId: user.spaceId.get(),
  });

const fromRedisUser = (redisUser: string): User => {
  const json = JSON.parse(redisUser);

  return new User(
    UserId.fromString(json.id),
    json.name,
    SpaceId.fromString(json.spaceId)
  );
};

export class UserRedisAdapter implements UserPort {
  private readonly redis: Redis;

  constructor({ redis }: Dependencies) {
    this.redis = redis;
  }

  async findUserById(userId: UserId): Promise<User> {
    const redisUser = await this.redis.get(userId.get());

    if (!redisUser) {
      throw new UserNotFoundError(userId);
    }

    return fromRedisUser(redisUser);
  }

  async saveUser(user: User): Promise<void> {
    const redisUser = toRedisUser(user);

    await this.redis.set(user.id.get(), redisUser);
  }
}
