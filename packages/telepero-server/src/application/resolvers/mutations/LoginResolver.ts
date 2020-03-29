import debug from "debug";

import { User } from "../../../domain/entities/User";
import { Space } from "../../../domain/entities/Space";
import { Login } from "../../../usecase/Login";
import { UserPort } from "../../../usecase/ports/UserPort";
import { SpacePort } from "../../../usecase/ports/SpacePort";
import { MutationArguments, MutationResolver } from "./types";

interface LoginArguments {
  slug: string;
}

interface LoginResult {
  success: boolean;
  session: {
    token: string;
    user: User;
    space: Space;
  };
}

interface Dependencies {
  login: Login;
  userPort: UserPort;
  spacePort: SpacePort;
}

const log = debug("app:resolver:login");

export class LoginResolver
  implements MutationResolver<unknown, LoginArguments, LoginResult> {
  private readonly login: Login;
  private readonly userPort: UserPort;
  private readonly spacePort: SpacePort;

  constructor({ login, userPort, spacePort }: Dependencies) {
    this.login = login;
    this.userPort = userPort;
    this.spacePort = spacePort;
  }

  async resolve(
    obj: unknown,
    { args }: MutationArguments<LoginArguments>
  ): Promise<LoginResult> {
    log("resolve");

    const session = await this.login.execute(args.slug);
    const [user, space] = await Promise.all([
      this.userPort.findUserById(session.userId),
      this.spacePort.findSpaceById(session.spaceId),
    ]);

    return {
      success: true,
      session: {
        token: session.token,
        user,
        space,
      },
    };
  }
}
