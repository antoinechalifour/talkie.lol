import debug from "debug";

import { Space } from "../../../domain/entities/Space";
import { CreateSpace } from "../../../usecase/CreateSpace";
import { MutationResolver } from "./types";

interface CreateSpaceResult {
  success: boolean;
  space: Space;
}

interface Dependencies {
  createSpace: CreateSpace;
}

const log = debug("app:resolver:CreateSpaceResolver");

export class CreateSpaceResolver
  implements MutationResolver<unknown, null, CreateSpaceResult> {
  private readonly createSpace: CreateSpace;

  constructor({ createSpace }: Dependencies) {
    this.createSpace = createSpace;
  }

  async resolve(): Promise<CreateSpaceResult> {
    log("resolve");

    const space = await this.createSpace.execute();

    return {
      success: true,
      space,
    };
  }
}
