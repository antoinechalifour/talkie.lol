import debug from "debug";

import { JoinSpace } from "../../../usecase/JoinSpace";
import { MutationArguments, MutationResolver } from "./types";

interface JoinSpaceArguments {
  slug: string;
}

interface JoinSpaceResult {
  success: boolean;
}

interface Dependencies {
  joinSpace: JoinSpace;
}

const log = debug("app:resolver:JoinSpaceResolver");

export class JoinSpaceResolver
  implements MutationResolver<unknown, JoinSpaceArguments, JoinSpaceResult> {
  private readonly joinSpace: JoinSpace;

  constructor({ joinSpace }: Dependencies) {
    this.joinSpace = joinSpace;
  }

  async resolve(
    obj: unknown,
    { args }: MutationArguments<JoinSpaceArguments>
  ): Promise<JoinSpaceResult> {
    log("resolve");

    await this.joinSpace.execute(args.slug);

    return { success: true };
  }
}
