import { ResolverFn } from "apollo-server-koa";

export type SubscriptionArguments<Arguments> = {
  args: Arguments;
};

export interface SubscriptionResolver<Parent, Arguments, Result> {
  resolve?(obj: Parent, args: Arguments): undefined | Result | Promise<Result>;
  subscribe: ResolverFn;
}
