/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

describe("leaveSpace", () => {
  let app: TalkieApp;
  let port: string;
  let anonymousClient: TalkieTestClient;

  beforeEach(async () => {
    ({ app, port } = await createTestApp());

    anonymousClient = TalkieTestClient.createAnonymousClient(port);

    await app.run();
  });

  afterEach(async () => {
    await app.stop();
  });

  describe("when other users are the the space", () => {
    let leavingUserClient: TalkieTestClient;
    let userInSpaceSession: GraphQLSession;
    let leavingUserSession: GraphQLSession;
    let space: GraphQLSpace;
    let subscriber: jest.Mock;
    let cleanUp: CleanUpFn;

    beforeEach(async () => {
      // Create a new space and login
      const createSpaceResult = await anonymousClient.createSpace();

      space = createSpaceResult.data!.createSpace.space;

      [userInSpaceSession, leavingUserSession] = await Promise.all([
        anonymousClient
          .login(space.slug, "old-user")
          .then(({ data }) => data!.login.session),
        anonymousClient
          .login(space.slug, "new-user")
          .then(({ data }) => data!.login.session),
      ]);

      // Setup subscriptions
      subscriber = jest.fn();
      leavingUserClient = await TalkieTestClient.createAuthenticatedClient(
        port,
        leavingUserSession.token
      );

      const oldUserClient = await TalkieTestClient.createAuthenticatedClient(
        port,
        userInSpaceSession.token
      );

      const { unsubscribe } = pipe(
        oldUserClient.onSpaceLeft(space.slug),
        subscribe((result) => subscriber(result.data))
      );

      cleanUp = () => {
        unsubscribe();
        leavingUserClient.close();
        oldUserClient.close();
      };
    });

    afterEach(() => {
      cleanUp();
    });

    it("should respond with a success", async () => {
      // When
      const response = await leavingUserClient.leaveSpace();
      await flushPromises();

      // Then
      expect(response.data!.leaveSpace).toMatchObject({
        success: true,
      });
    });

    it("should notify other users", async () => {
      // When
      await leavingUserClient.leaveSpace();
      await flushPromises();

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith({
        spaceLeft: {
          space: {
            id: space.id,
            slug: space.slug,
          },
          user: {
            id: leavingUserSession.user.id,
            name: leavingUserSession.user.name,
          },
        },
      });
    });
  });

  describe("when users are in an other space", () => {
    let userInSpace2Client: TalkieTestClient;
    let userInSpace1Session: GraphQLSession;
    let userInSpace2Session: GraphQLSession;
    let userInSpace1Subscriber: jest.Mock;
    let cleanUp: CleanUpFn;

    beforeEach(async () => {
      // Create a 2 new spaces and login in each space
      const createSpace1Result = await anonymousClient.createSpace();
      const space1 = createSpace1Result.data!.createSpace.space;
      const createSpace2Result = await anonymousClient.createSpace();
      const space2 = createSpace2Result.data!.createSpace.space;

      [userInSpace1Session, userInSpace2Session] = await Promise.all([
        anonymousClient
          .login(space1.slug, "user-in-space-1")
          .then(({ data }) => data!.login.session),
        anonymousClient
          .login(space2.slug, "user-in-space2")
          .then(({ data }) => data!.login.session),
      ]);

      // Setup subscriptions
      userInSpace1Subscriber = jest.fn();
      userInSpace2Client = await TalkieTestClient.createAuthenticatedClient(
        port,
        userInSpace2Session.token
      );

      const userInSpace1Client = await TalkieTestClient.createAuthenticatedClient(
        port,
        userInSpace1Session.token
      );

      const { unsubscribe } = pipe(
        userInSpace1Client.onSpaceLeft(space1.slug),
        subscribe((result) => userInSpace1Subscriber(result.data))
      );

      cleanUp = () => {
        unsubscribe();
        userInSpace1Client.close();
        userInSpace2Client.close();
      };
    });

    afterEach(() => {
      cleanUp();
    });

    it("should not notify them", async () => {
      // When
      await userInSpace2Client.leaveSpace();
      await flushPromises();

      // Then
      expect(userInSpace1Subscriber).toHaveBeenCalledTimes(0);
    });
  });
});
