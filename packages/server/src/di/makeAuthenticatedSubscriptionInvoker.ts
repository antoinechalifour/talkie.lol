import debug from "debug";
import { asClass } from "awilix";

import { SubscriptionArguments } from "../application/resolvers/subscriptions/types";
import { AuthenticatedSubscriptionResolver } from "../application/resolvers/subscriptions/AuthenticatedSubscriptionResolver";
import { GraphQLContext } from "../application/types";
import { SubscriptionResolverConstructor } from "./types";

const log = debug("app:di:makeAuthenticatedSubscriptionInvoker");

export function makeAuthenticatedSubscriptionInvoker<Parent, Arguments, Result>(
  Resolver: SubscriptionResolverConstructor<Parent, Arguments, Result>
) {
  log(`Decorating resolver ${Resolver.name}`);
  return {
    subscribe: function (
      obj: Parent,
      { args }: SubscriptionArguments<Arguments>,
      { container }: GraphQLContext
    ) {
      log(`Building authenticated resolver for subscription ${Resolver.name}`);

      const resolver = container.build(AuthenticatedSubscriptionResolver, {
        injector: () => ({
          decoratedResolver: container.build(Resolver),
        }),
      });

      return resolver.subscribe(obj, args);
    },
    resolve: function (
      obj: Parent,
      { args }: SubscriptionArguments<Arguments>,
      { container }: GraphQLContext
    ) {
      log(`Building authenticated resolver for resolving ${Resolver.name}`);

      const resolver = container.build(AuthenticatedSubscriptionResolver, {
        injector: () => ({
          decoratedResolver: container.build(Resolver),
        }),
      });

      if (resolver.resolve) {
        return resolver.resolve(obj, args);
      }
    },
  };
}
