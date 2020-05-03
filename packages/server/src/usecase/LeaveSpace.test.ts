import { User } from "../domain/entities/User";
import { Space } from "../domain/entities/Space";
import { SpaceMemoryAdapter } from "../infrastructure/SpaceMemoryAdapter";
import { NotificationPort } from "./ports/NotificationPort";
import { SpacePort } from "./ports/SpacePort";
import { LeaveSpace } from "./LeaveSpace";

const mockNotificationPort = (): NotificationPort => ({
  notifyRtcIceCandidateReceived: jest.fn(),
  notifyRtcAnswerReceived: jest.fn(),
  notifyRtcOfferReceived: jest.fn(),
  notifySpaceJoined: jest.fn(),
  notifySpaceLeft: jest.fn(),
});

describe("LeaveSpace", () => {
  let space: Space;
  let notificationPort: NotificationPort;
  let spacePort: SpacePort;
  let leaveSpace: LeaveSpace;
  let currentUser: User;

  beforeEach(() => {
    spacePort = new SpaceMemoryAdapter();
    notificationPort = mockNotificationPort();
    space = Space.createSpace();
    currentUser = User.create(space.id, "user-name");

    leaveSpace = new LeaveSpace({
      spacePort,
      notificationPort,
      currentUser,
    });
  });

  it("should notify other users in the space", async () => {
    // Given
    await spacePort.saveSpace(space);

    // When
    await leaveSpace.execute();

    // Then
    expect(notificationPort.notifySpaceLeft).toHaveBeenCalledTimes(1);
    expect(notificationPort.notifySpaceLeft).toHaveBeenCalledWith(
      space,
      currentUser
    );
  });
});
