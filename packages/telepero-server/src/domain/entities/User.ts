import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { UserId } from "./UserId";

export class User {
  constructor(public id: UserId, public name: string) {}

  static create() {
    const name = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 2,
    });

    return new User(UserId.create(), name);
  }
}
