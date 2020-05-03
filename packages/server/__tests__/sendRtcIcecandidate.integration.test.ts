/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwilixContainer } from "awilix";
import { pipe, subscribe } from "wonka";

import { TalkieApp } from "../src/application/server";
import {
  TalkieTestClient,
  GraphQLSession,
  GraphQLSpace,
} from "./utils/TalkieTestClient";
import { createTestApp } from "./utils/createTestApp";
import { flushPromises } from "./utils/flushPromises";

type CleanUpFn = () => void;

describe("sendRtcIceCandidate", () => {
  let app: TalkieApp;
  let port: string;
  let container: AwilixContainer;
  let anonymousClient: TalkieTestClient;
  let senderClient: TalkieTestClient;
  let sender: GraphQLSession;
  let recipient: GraphQLSession;
  let otherUser: GraphQLSession;
  let space: GraphQLSpace;
  let recipientSubscriber: jest.Mock;
  let otherUserSubscriber: jest.Mock;
  let cleanUp: CleanUpFn;

  beforeEach(async () => {
    ({ app, port, container } = await createTestApp());

    anonymousClient = TalkieTestClient.createAnonymousClient(port);

    await app.run();

    // Create a new space and login
    const createSpaceResult = await anonymousClient.createSpace();

    space = createSpaceResult.data!.createSpace.space;

    [sender, recipient, otherUser] = await Promise.all([
      anonymousClient
        .login(space.slug, "sender-user")
        .then(({ data }) => data!.login.session),
      anonymousClient
        .login(space.slug, "recipient-user")
        .then(({ data }) => data!.login.session),
      anonymousClient
        .login(space.slug, "other-user")
        .then(({ data }) => data!.login.session),
    ]);

    // Setup subscriptions
    recipientSubscriber = jest.fn();
    otherUserSubscriber = jest.fn();

    senderClient = await TalkieTestClient.createAuthenticatedClient(
      port,
      sender.token
    );

    const recipientClient = await TalkieTestClient.createAuthenticatedClient(
      port,
      recipient.token
    );

    const otherUserClient = await TalkieTestClient.createAuthenticatedClient(
      port,
      otherUser.token
    );

    const { unsubscribe: unsubscribeRecipient } = pipe(
      recipientClient.onRtcIceCandidateReceived(),
      subscribe((result) => recipientSubscriber(result.data))
    );

    const { unsubscribe: unsubscribeOtherUser } = pipe(
      otherUserClient.onRtcIceCandidateReceived(),
      subscribe((result) => otherUserSubscriber(result.data))
    );

    cleanUp = () => {
      unsubscribeRecipient();
      unsubscribeOtherUser();
      senderClient.close();
      recipientClient.close();
      otherUserClient.close();
    };
  });

  afterEach(async () => {
    cleanUp();

    await app.stop();
  });

  it("should respond with a success", async () => {
    // Given
    const recipientId = recipient.user.id;
    const candidate = "rtc-ice-candidate";
    const sdpMid = "sdp-m-id";
    const sdpMLineIndex = 0;

    // When
    const response = await senderClient.sendRtcIceCandidate(
      recipientId,
      candidate,
      sdpMid,
      sdpMLineIndex
    );
    await flushPromises();

    // Then
    expect(response.data!.sendRtcIceCandidate).toMatchObject({
      success: true,
    });
  });

  it("should notify the recipient", async () => {
    // Given
    const recipientId = recipient.user.id;
    const candidate = "rtc-ice-candidate";
    const sdpMid = "sdp-m-id";
    const sdpMLineIndex = 0;

    // When
    await senderClient.sendRtcIceCandidate(
      recipientId,
      candidate,
      sdpMid,
      sdpMLineIndex
    );
    await flushPromises();

    // Then
    expect(recipientSubscriber).toHaveBeenCalledTimes(1);
    expect(recipientSubscriber).toHaveBeenCalledWith({
      iceCandidateReceived: {
        iceCandidate: {
          candidate,
          sdpMid,
          sdpMLineIndex,
        },
        sender: {
          id: sender.user.id,
          name: sender.user.name,
        },
      },
    });
  });

  it("should notify the recipient", async () => {
    // Given
    const recipientId = recipient.user.id;
    const candidate = "rtc-ice-candidate";
    const sdpMid = "sdp-m-id";
    const sdpMLineIndex = 0;

    // When
    await senderClient.sendRtcIceCandidate(
      recipientId,
      candidate,
      sdpMid,
      sdpMLineIndex
    );
    await flushPromises();

    // Then
    expect(otherUserSubscriber).toHaveBeenCalledTimes(0);
  });
});
