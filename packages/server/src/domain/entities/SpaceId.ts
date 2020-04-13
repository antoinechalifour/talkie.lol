import * as uuid from "uuid";

export class SpaceId {
  private constructor(private id: string) {}

  get(): string {
    return this.id;
  }

  is(spaceId: SpaceId): boolean {
    return this.id === spaceId.id;
  }

  static create(): SpaceId {
    return new SpaceId(`space-${uuid.v4()}`);
  }

  static fromString(id: string): SpaceId {
    return new SpaceId(id);
  }
}
