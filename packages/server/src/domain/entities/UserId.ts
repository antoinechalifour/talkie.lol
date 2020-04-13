import * as uuid from "uuid";

export class UserId {
  private constructor(private id: string) {}

  get(): string {
    return this.id;
  }

  is(userId: UserId): boolean {
    return this.id === userId.id;
  }

  static create(): UserId {
    return new UserId(`user-${uuid.v4()}`);
  }

  static fromString(id: string): UserId {
    return new UserId(id);
  }
}
