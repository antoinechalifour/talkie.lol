import * as uuid from "uuid";

export class UserId {
  private constructor(private id: string) {}

  get() {
    return this.id;
  }

  equals(userId: UserId) {
    return this.id === userId.id;
  }

  static create() {
    return new UserId(`user-${uuid.v4()}`);
  }

  static fromString(id: string) {
    return new UserId(id);
  }
}
