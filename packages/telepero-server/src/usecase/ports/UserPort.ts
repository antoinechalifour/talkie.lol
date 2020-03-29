import { UserId } from "../../domain/entities/UserId";
import { User } from "../../domain/entities/User";

export interface UserPort {
  findUserById(userId: UserId): Promise<User>;

  saveUser(user: User): Promise<void>;
}
