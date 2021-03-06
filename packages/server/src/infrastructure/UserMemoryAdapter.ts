import { UserId } from "../domain/entities/UserId";
import { User } from "../domain/entities/User";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError";
import { UserPort } from "../usecase/ports/UserPort";

export class UserMemoryAdapter implements UserPort {
  _byId = new Map<string, User>();

  findUserById(userId: UserId): Promise<User> {
    const user = this._byId.get(userId.get());

    if (user) return Promise.resolve(user);

    throw new UserNotFoundError(userId);
  }

  saveUser(user: User): Promise<void> {
    this._byId.set(user.id.get(), user);

    return Promise.resolve();
  }
}
