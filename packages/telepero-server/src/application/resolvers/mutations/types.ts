export type MutationArguments<T> = {
  args: T;
};

export interface MutationResolver<Parent, Arguments, Result> {
  resolve(
    obj: Parent,
    args: MutationArguments<Arguments>
  ): Result | Promise<Result>;
}
