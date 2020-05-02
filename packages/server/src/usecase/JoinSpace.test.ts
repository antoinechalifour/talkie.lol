import { User } from "../domain/entities/User";
import { Space } from "../domain/entities/Space";
import { SpaceMemoryAdapter } from "../infrastructure/SpaceMemoryAdapter";
import { NotificationPort } from "./ports/NotificationPort";
import { SpacePort } from "./ports/SpacePort";
import { JoinSpace } from "./JoinSpace";

const mockNotificationPort = () => ({
  notifyRtcIceCandidateReceived: jest.fn(),
  notifyRtcAnswerReceived: jest.fn(),
  notifyRtcOfferReceived: jest.fn(),
  notifySpaceJoined: jest.fn(),
  notifySpaceLeft: jest.fn(),
});

describe("JoinSpace", () => {
  let space: Space;
  let notificationPort: NotificationPort;
  let spacePort: SpacePort;
  let joinSpace: JoinSpace;
  let currentUser: User;

  beforeEach(() => {
    spacePort = new SpaceMemoryAdapter();
    notificationPort = mockNotificationPort();
    space = Space.createSpace();
    currentUser = User.create(space.id, "user-name");

    joinSpace = new JoinSpace({
      spacePort,
      notificationPort,
      currentUser,
    });
  });

  it("should notify other users in the space", async () => {
    // Given
    await spacePort.saveSpace(space);

    // When
    await joinSpace.execute();

    // Then
    expect(notificationPort.notifySpaceJoined).toHaveBeenCalledTimes(1);
    expect(notificationPort.notifySpaceJoined).toHaveBeenCalledWith(
      space,
      currentUser
    );
  });
});
