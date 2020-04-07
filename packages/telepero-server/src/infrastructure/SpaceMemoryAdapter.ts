import debug from "debug";

import { Space } from "../domain/entities/Space";
import { SpaceId } from "../domain/entities/SpaceId";
import { SpaceNotFoundError } from "../domain/errors/SpaceNotFoundError";
import { SpacePort } from "../usecase/ports/SpacePort";

const log = debug("app:adapter:space");

export class SpaceMemoryAdapter implements SpacePort {
  private static _spaces = new Map<SpaceId, Space>();

  saveSpace(space: Space): Promise<void> {
    log(`Saving space ${space.id.get()}`);

    SpaceMemoryAdapter._spaces.set(space.id, space);

    return Promise.resolve();
  }

  findSpaceById(spaceId: SpaceId): Promise<Space> {
    log(`Finding space ${spaceId.get()}`);

    for (const space of SpaceMemoryAdapter._spaces.values()) {
      if (space.id.is(spaceId)) {
        return Promise.resolve(space);
      }
    }

    throw new SpaceNotFoundError(spaceId.get());
  }

  findSpaceBySlug(slug: string): Promise<Space> {
    log(`Finding space ${slug}`);

    for (const space of SpaceMemoryAdapter._spaces.values()) {
      if (space.compareBySlug(slug)) {
        return Promise.resolve(space);
      }
    }

    throw new SpaceNotFoundError(slug);
  }
}
