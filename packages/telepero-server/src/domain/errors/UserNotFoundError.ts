import { UserId } from "../entities/UserId";

export class UserNotFoundError extends Error {
  constructor(userId: UserId) {
    super(`User not found (Id: ${userId.get()}`);
  }
}
