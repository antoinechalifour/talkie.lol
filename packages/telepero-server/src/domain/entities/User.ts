import { UserId } from "./UserId";

export class User {
  private constructor(public id: UserId) {}

  static create() {
    return new User(UserId.create());
  }
}
