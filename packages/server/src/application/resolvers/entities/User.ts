import { User } from "../../../domain/entities/User";

export const UserResolver = {
  id: (user: User) => user.id.get(),
};
