import { SessionDescription } from "../domain/entities/SessionDescription";
import { User } from "../domain/entities/User";
import { SpaceId } from "../domain/entities/SpaceId";
import { UserMemoryAdapter } from "../infrastructure/UserMemoryAdapter";
import { UserPort } from "./ports/UserPort";
import { NotificationPort } from "./ports/NotificationPort";
import { SendRtcOffer } from "./SendRtcOffer";

const mockNotificationPort = (): NotificationPort => ({
  notifyRtcIceCandidateReceived: jest.fn(),
  notifyRtcAnswerReceived: jest.fn(),
  notifyRtcOfferReceived: jest.fn(),
  notifySpaceJoined: jest.fn(),
  notifySpaceLeft: jest.fn(),
});

describe("SendRtcOffer", () => {
  let currentUser: User;
  let recipient: User;
  let sendRtcOffer: SendRtcOffer;
  let userPort: UserPort;
  let notificationPort: NotificationPort;

  beforeEach(async () => {
    const spaceId = SpaceId.create();

    recipient = User.create(spaceId, "John Williams");
    currentUser = User.create(spaceId, "Jane Doe");
    notificationPort = mockNotificationPort();
    userPort = new UserMemoryAdapter();

    await userPort.saveUser(recipient);

    sendRtcOffer = new SendRtcOffer({
      userPort,
      notificationPort,
      currentUser,
    });
  });

  it("should send the offer to the recipient", async () => {
    // Given
    const offer = "sdp-offer";
    const recipientId = recipient.id.get();

    // When
    await sendRtcOffer.execute(offer, recipientId);

    // Then
    const expectedSessionDescription = SessionDescription.offer(offer);

    expect(notificationPort.notifyRtcOfferReceived).toHaveBeenCalledTimes(1);
    expect(notificationPort.notifyRtcOfferReceived).toHaveBeenCalledWith(
      expectedSessionDescription,
      currentUser,
      recipient
    );
  });
});
