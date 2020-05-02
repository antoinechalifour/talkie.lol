import { Space } from "../domain/entities/Space";
import { Token } from "../domain/entities/Token";
import { SpaceMemoryAdapter } from "../infrastructure/SpaceMemoryAdapter";
import { UserMemoryAdapter } from "../infrastructure/UserMemoryAdapter";
import { SpacePort } from "./ports/SpacePort";
import { UserPort } from "./ports/UserPort";
import { TokenPort } from "./ports/TokenPort";
import { Login } from "./Login";
import { Session } from "../domain/entities/Session";
import { UserId } from "../domain/entities/UserId";

describe("Login", () => {
  let spacePort: SpacePort;
  let userPort: UserPort;
  let tokenPort: TokenPort<Token>;
  let login: Login;
  let space: Space;

  beforeEach(async () => {
    space = Space.createSpace();

    spacePort = new SpaceMemoryAdapter();
    userPort = new UserMemoryAdapter();
    tokenPort = {
      decode: jest.fn(),
      sign: jest.fn().mockReturnValue("signed-token"),
    };

    await spacePort.saveSpace(space);

    login = new Login({
      spacePort,
      userPort,
      tokenPort,
    });
  });

  it("should create a user for the space and return a new session", async () => {
    // Given
    const slug = space.slug;
    const userName = "Jane Doe";

    // When
    const session = await login.execute(slug, userName);

    // Then
    const persistedUser = await userPort.findUserById(session.userId);
    const expectedSession = Session.create(
      "signed-token",
      expect.any(UserId),
      space.id
    );
    expect(session).toEqual(expectedSession);
    expect(persistedUser).not.toBeNull();
  });
});
