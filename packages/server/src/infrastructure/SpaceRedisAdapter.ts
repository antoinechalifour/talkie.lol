import { Redis } from "ioredis";

import { Space } from "../domain/entities/Space";
import { SpaceId } from "../domain/entities/SpaceId";
import { SpaceNotFoundError } from "../domain/errors/SpaceNotFoundError";
import { SpacePort } from "../usecase/ports/SpacePort";

interface Dependencies {
  redis: Redis;
}

const toRedisSpace = (space: Space): string =>
  JSON.stringify({
    id: space.id.get(),
    slug: space.slug,
  });

const fromRedisSpace = (redisSpace: string): Space => {
  const json = JSON.parse(redisSpace);

  return new Space(SpaceId.fromString(json.id), json.slug);
};

export class SpaceRedisAdapter implements SpacePort {
  private readonly redis: Redis;

  constructor({ redis }: Dependencies) {
    this.redis = redis;
  }

  async findSpaceById(spaceId: SpaceId): Promise<Space> {
    const redisSpace = await this.redis.get(spaceId.get());

    if (!redisSpace) {
      throw new SpaceNotFoundError(spaceId.get());
    }

    return fromRedisSpace(redisSpace);
  }

  async findSpaceBySlug(slug: string): Promise<Space> {
    const redisSpace = await this.redis.get(slug);

    if (!redisSpace) {
      throw new SpaceNotFoundError(slug);
    }

    return fromRedisSpace(redisSpace);
  }

  async saveSpace(space: Space): Promise<void> {
    const redisSpace = toRedisSpace(space);

    await Promise.all([
      this.redis.set(space.id.get(), redisSpace),
      this.redis.set(space.slug, redisSpace),
    ]);
  }
}
