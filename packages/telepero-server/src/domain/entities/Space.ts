import humanId from "human-id";

import { SpaceId } from "./SpaceId";

export class Space {
  constructor(public id: SpaceId, public slug: string) {}

  compareBySlug(slug: string) {
    return this.slug === slug;
  }

  static createSpace() {
    const slug = humanId({
      separator: "-",
      capitalize: false,
    });

    return new Space(SpaceId.create(), slug);
  }
}
