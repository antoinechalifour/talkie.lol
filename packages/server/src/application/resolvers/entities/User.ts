import { User } from "../../../domain/entities/User";

export const UserResolver = {
  id: (user: User): string => user.id.get(),
};
