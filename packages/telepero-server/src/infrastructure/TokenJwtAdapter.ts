import jwt from "jsonwebtoken";

import { Token } from "../domain/entities/Token";
import { UserId } from "../domain/entities/UserId";
import { SpaceId } from "../domain/entities/SpaceId";
import { TokenPort } from "../usecase/ports/TokenPort";

interface Dependencies {
  secret: string;
}

export class TokenJwtAdapter implements TokenPort<Token> {
  private readonly secret: string;

  constructor({ secret }: Dependencies) {
    this.secret = secret;
  }

  decode(token: string): Promise<Token> {
    const payload: any = jwt.verify(token, this.secret);

    return Promise.resolve(
      Token.create(
        UserId.fromString(payload.userId),
        SpaceId.fromString(payload.spaceId)
      )
    );
  }

  sign(token: Token): Promise<string> {
    const signedToken = jwt.sign(
      {
        userId: token.userId.get(),
        spaceId: token.spaceId.get(),
      },
      this.secret
    );

    return Promise.resolve(signedToken);
  }
}
