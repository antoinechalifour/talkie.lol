import debug from "debug";

import { User } from "../domain/entities/User";
import { Token } from "../domain/entities/Token";
import { Session } from "../domain/entities/Session";
import { UserPort } from "./ports/UserPort";
import { TokenPort } from "./ports/TokenPort";
import { SpacePort } from "./ports/SpacePort";

interface Dependencies {
  userPort: UserPort;
  spacePort: SpacePort;
  tokenPort: TokenPort<Token>;
}

const log = debug("app:usecase:Login");

export class Login {
  private readonly userPort: UserPort;
  private readonly spacePort: SpacePort;
  private readonly tokenPort: TokenPort<Token>;

  constructor({ userPort, tokenPort, spacePort }: Dependencies) {
    this.userPort = userPort;
    this.spacePort = spacePort;
    this.tokenPort = tokenPort;
  }

  async execute(slug: string, userName: string | null): Promise<Session> {
    log("execute");

    const space = await this.spacePort.findSpaceBySlug(slug);
    const user = User.create(space.id, userName);

    await this.userPort.saveUser(user);

    const token = await this.tokenPort.sign(Token.create(user.id, space.id));

    return Session.create(token, user.id, space.id);
  }
}
