import humanId from "human-id";

import { SpaceId } from "./SpaceId";

export class Space {
  constructor(public id: SpaceId, public slug: string) {}

  compareBySlug(slug: string): boolean {
    return this.slug === slug;
  }

  static createSpace(): Space {
    const slug = humanId({
      separator: "-",
      capitalize: false,
    });

    return new Space(SpaceId.create(), slug);
  }
}
