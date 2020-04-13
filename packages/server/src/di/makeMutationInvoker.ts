import debug from "debug";

import { MutationArguments } from "../application/resolvers/mutations/types";
import { GraphQLContext } from "../application/types";
import { MutationResolverConstructor } from "./types";

const log = debug("app:di:makeMutationInvoker");

export function makeMutationInvoker<Parent, Arguments, Result>(
  Resolver: MutationResolverConstructor<Parent, Arguments, Result>
) {
  return function (
    obj: Parent,
    args: MutationArguments<Arguments>,
    context: GraphQLContext
  ): Result | Promise<Result> {
    log(`Building resolver ${Resolver.name}`);

    const resolver = context.container.build(Resolver);

    return resolver.resolve(obj, args);
  };
}
