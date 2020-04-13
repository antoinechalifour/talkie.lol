import debug from "debug";

import { User } from "../../../domain/entities/User";
import { LeaveSpace } from "../../../usecase/LeaveSpace";
import { MutationArguments, MutationResolver } from "./types";

interface LeaveSpaceResult {
  success: boolean;
  user: User;
}

interface Dependencies {
  leaveSpace: LeaveSpace;
}

const log = debug("app:resolver:LeaveSpaceResolver");

export class LeaveSpaceResolver
  implements MutationResolver<unknown, {}, LeaveSpaceResult> {
  private readonly leaveSpace: LeaveSpace;

  constructor({ leaveSpace }: Dependencies) {
    this.leaveSpace = leaveSpace;
  }

  async resolve(
    obj: unknown,
    args: MutationArguments<{}>
  ): Promise<LeaveSpaceResult> {
    log("resolve");

    const user = await this.leaveSpace.execute();

    return { success: true, user };
  }
}
