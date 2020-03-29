import { Mutation } from "./mutations";
import { Subscription } from "./subscriptions";
import { Entities } from "./entities";

export const resolvers = {
  ...Entities,
  Mutation,
  Subscription,
};
