import * as uuid from "uuid";

export class SpaceId {
  private constructor(private id: string) {}

  get() {
    return this.id;
  }

  equals(spaceId: SpaceId) {
    return this.id === spaceId.id;
  }

  static create() {
    return new SpaceId(`space-${uuid.v4()}`);
  }

  static fromString(id: string) {
    return new SpaceId(id);
  }
}
