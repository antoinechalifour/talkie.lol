import debug from "debug";

import { MutationArguments } from "../application/resolvers/mutations/types";
import { AuthenticatedMutationResolver } from "../application/resolvers/mutations/AuthenticatedMutationResolver";
import { GraphQLContext } from "../application/types";
import { MutationResolverConstructor } from "./types";

const log = debug("app:di:makeAuthenticatedMutationInvoker");

export function makeAuthenticatedMutationInvoker<Parent, Arguments, Result>(
  Resolver: MutationResolverConstructor<ParentNode, Arguments, Result>
) {
  log(`Decorating resolver ${Resolver.name}`);
  return function (
    obj: Parent,
    args: MutationArguments<Arguments>,
    context: GraphQLContext
  ) {
    log(`Building authenticated resolver ${Resolver.name}`);

    const resolver = context.container.build(AuthenticatedMutationResolver, {
      injector: (container) => ({
        decoratedResolver: container.build(Resolver),
      }),
    });

    return resolver.resolve(obj, args);
  };
}
