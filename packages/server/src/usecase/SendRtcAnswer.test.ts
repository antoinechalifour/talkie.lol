import { SessionDescription } from "../domain/entities/SessionDescription";
import { User } from "../domain/entities/User";
import { SpaceId } from "../domain/entities/SpaceId";
import { UserMemoryAdapter } from "../infrastructure/UserMemoryAdapter";
import { UserPort } from "./ports/UserPort";
import { NotificationPort } from "./ports/NotificationPort";
import { SendRtcAnswer } from "./SendRtcAnswer";

const mockNotificationPort = (): NotificationPort => ({
  notifyRtcIceCandidateReceived: jest.fn(),
  notifyRtcAnswerReceived: jest.fn(),
  notifyRtcOfferReceived: jest.fn(),
  notifySpaceJoined: jest.fn(),
  notifySpaceLeft: jest.fn(),
});

describe("SendRtcAnswer", () => {
  let currentUser: User;
  let recipient: User;
  let sendRtcAnswer: SendRtcAnswer;
  let userPort: UserPort;
  let notificationPort: NotificationPort;

  beforeEach(async () => {
    const spaceId = SpaceId.create();

    recipient = User.create(spaceId, "John Williams");
    currentUser = User.create(spaceId, "Jane Doe");
    notificationPort = mockNotificationPort();
    userPort = new UserMemoryAdapter();

    await userPort.saveUser(recipient);

    sendRtcAnswer = new SendRtcAnswer({
      userPort,
      notificationPort,
      currentUser,
    });
  });

  it("should send the answer to the recipient", async () => {
    // Given
    const answer = "sdp-answer";
    const recipientId = recipient.id.get();

    // When
    await sendRtcAnswer.execute(answer, recipientId);

    // Then
    const expectedSessionDescription = SessionDescription.answer(answer);

    expect(notificationPort.notifyRtcAnswerReceived).toHaveBeenCalledTimes(1);
    expect(notificationPort.notifyRtcAnswerReceived).toHaveBeenCalledWith(
      expectedSessionDescription,
      currentUser,
      recipient
    );
  });
});
