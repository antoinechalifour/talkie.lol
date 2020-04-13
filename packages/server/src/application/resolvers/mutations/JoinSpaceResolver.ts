import debug from "debug";

import { JoinSpace } from "../../../usecase/JoinSpace";
import { MutationResolver } from "./types";

interface JoinSpaceResult {
  success: boolean;
}

interface Dependencies {
  joinSpace: JoinSpace;
}

const log = debug("app:resolver:JoinSpaceResolver");

export class JoinSpaceResolver
  implements MutationResolver<unknown, {}, JoinSpaceResult> {
  private readonly joinSpace: JoinSpace;

  constructor({ joinSpace }: Dependencies) {
    this.joinSpace = joinSpace;
  }

  async resolve(): Promise<JoinSpaceResult> {
    log("resolve");

    await this.joinSpace.execute();

    return { success: true };
  }
}
