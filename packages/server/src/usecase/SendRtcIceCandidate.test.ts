import { User } from "../domain/entities/User";
import { IceCandidate } from "../domain/entities/IceCandidate";
import { SpaceId } from "../domain/entities/SpaceId";
import { UserMemoryAdapter } from "../infrastructure/UserMemoryAdapter";
import { UserPort } from "./ports/UserPort";
import { NotificationPort } from "./ports/NotificationPort";
import { SendRtcIceCandidate } from "./SendRtcIceCandidate";

const mockNotificationPort = () => ({
  notifyRtcIceCandidateReceived: jest.fn(),
  notifyRtcAnswerReceived: jest.fn(),
  notifyRtcOfferReceived: jest.fn(),
  notifySpaceJoined: jest.fn(),
  notifySpaceLeft: jest.fn(),
});

describe("SendRtcIceCandidate", () => {
  let currentUser: User;
  let recipient: User;
  let sendRtcIceCandidate: SendRtcIceCandidate;
  let userPort: UserPort;
  let notificationPort: NotificationPort;

  beforeEach(async () => {
    const spaceId = SpaceId.create();

    recipient = User.create(spaceId, "John Williams");
    currentUser = User.create(spaceId, "Jane Doe");
    notificationPort = mockNotificationPort();
    userPort = new UserMemoryAdapter();

    await userPort.saveUser(recipient);

    sendRtcIceCandidate = new SendRtcIceCandidate({
      userPort,
      notificationPort,
      currentUser,
    });
  });

  it("should send the ice candidate to the recipient", async () => {
    // Given
    const iceCandidate = "ice-candidate";
    const sdpMid = "sdp-mid";
    const sdpMLineIndex = 2;
    const recipientId = recipient.id.get();

    // When
    await sendRtcIceCandidate.execute(
      iceCandidate,
      sdpMid,
      sdpMLineIndex,
      recipientId
    );

    // Then
    const expectedIceCandidate = IceCandidate.create(
      iceCandidate,
      sdpMid,
      sdpMLineIndex
    );

    expect(
      notificationPort.notifyRtcIceCandidateReceived
    ).toHaveBeenCalledTimes(1);
    expect(notificationPort.notifyRtcIceCandidateReceived).toHaveBeenCalledWith(
      expectedIceCandidate,
      currentUser,
      recipient
    );
  });
});
