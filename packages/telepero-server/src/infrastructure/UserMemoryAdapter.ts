import debug from "debug";

import { UserId } from "../domain/entities/UserId";
import { User } from "../domain/entities/User";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError";
import { UserPort } from "../usecase/ports/UserPort";

const log = debug("app:adapter:user");

export class UserMemoryAdapter implements UserPort {
  private static _users = new Map<UserId, User>();

  findUserById(userId: UserId): Promise<User> {
    log(`Finding user ${userId.get()}`);

    for (const user of UserMemoryAdapter._users.values()) {
      if (user.id.equals(userId)) {
        return Promise.resolve(user);
      }
    }

    throw new UserNotFoundError(userId);
  }

  saveUser(user: User): Promise<void> {
    log(`Saving user ${user.id.get()}`);
    UserMemoryAdapter._users.set(user.id, user);

    return Promise.resolve();
  }
}
