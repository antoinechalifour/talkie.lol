import debug from "debug";

import { User } from "../../../domain/entities/User";
import { MutationArguments, MutationResolver } from "./types";

interface Dependencies<Parent, Arguments, Result> {
  decoratedResolver: MutationResolver<Parent, Arguments, Result>;
  currentUser: User;
}

const log = debug("app:resolver:AuthenticationMutationResolver");

export class AuthenticatedMutationResolver<Parent, Arguments, Result>
  implements MutationResolver<Parent, Arguments, Result> {
  private readonly resolver: MutationResolver<Parent, Arguments, Result>;
  private readonly currentUser: User;

  constructor({
    decoratedResolver,
    currentUser,
  }: Dependencies<Parent, Arguments, Result>) {
    this.resolver = decoratedResolver;
    this.currentUser = currentUser;
  }

  resolve(
    obj: Parent,
    args: MutationArguments<Arguments>
  ): Promise<Result> | Result {
    if (!this.currentUser) {
      log("User is not authenticated");
      throw new Error("User must be authenticated");
    }

    log(`Authentication successful for user ${this.currentUser.id.get()}`);
    return this.resolver.resolve(obj, args);
  }
}
