import { MutationResolver } from "../application/resolvers/mutations/types";
import { SubscriptionResolver } from "../application/resolvers/subscriptions/types";

export interface MutationResolverConstructor<Parent, Arguments, Result> {
  new (dependencies: any): MutationResolver<Parent, Arguments, Result>;
}

export interface SubscriptionResolverConstructor<Parent, Arguments, Result> {
  new (dependencies: any): SubscriptionResolver<Parent, Arguments, Result>;
}
