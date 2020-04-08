import debug from "debug";

import { User } from "../../../domain/entities/User";
import { SubscriptionResolver } from "./types";

interface Dependencies<Parent, Arguments, Result> {
  decoratedResolver: SubscriptionResolver<Parent, Arguments, Result>;
  currentUser: User;
}

const log = debug("app:resolver:AuthenticatedSubscriptionResolver");

export class AuthenticatedSubscriptionResolver<Parent, Arguments, Result>
  implements SubscriptionResolver<Parent, Arguments, Result> {
  private readonly resolver: SubscriptionResolver<Parent, Arguments, Result>;
  private readonly currentUser: User;

  constructor({
    decoratedResolver,
    currentUser,
  }: Dependencies<Parent, Arguments, Result>) {
    this.resolver = decoratedResolver;
    this.currentUser = currentUser;
  }

  subscribe(parent: Parent, args: Arguments) {
    if (!this.currentUser) {
      log("Cannot subscribe, user is not authenticated");
      throw new Error("User must be authenticated");
    }

    return this.resolver.subscribe(parent, args);
  }

  resolve(obj: Parent, args: Arguments): any {
    if (!this.resolver.resolve) {
      return undefined;
    }

    if (!this.currentUser) {
      log("Cannot resolve, user is not authenticated");
      throw new Error("User must be authenticated");
    }

    return this.resolver.resolve(obj, args);
  }
}
