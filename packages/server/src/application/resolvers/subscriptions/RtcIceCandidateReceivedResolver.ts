import { PubSub, withFilter } from "apollo-server-koa";
import debug from "debug";

import { RtcIceCandidateReceivedEvent } from "../../../domain/events/RtcIceCandidateReceivedEvent";
import { User } from "../../../domain/entities/User";
import { UserId } from "../../../domain/entities/UserId";
import { UserPort } from "../../../usecase/ports/UserPort";
import { SubscriptionResolver } from "./types";
import { IceCandidate } from "../../../domain/entities/IceCandidate";

interface Dependencies {
  userPort: UserPort;
  pubSub: PubSub;
  currentUser: User;
}

interface RtcIceCandidateReceivedResult {
  iceCandidate: {
    candidate: string;
    sdpMid: string;
    sdpMLineIndex: number;
  };
  sender: User;
}

const log = debug("app:resolver:RtcIceCandidateReceivedResolver");

export class RtcIceCandidateReceivedResolver
  implements
    SubscriptionResolver<
      RtcIceCandidateReceivedEvent,
      void,
      RtcIceCandidateReceivedResult
    > {
  private readonly userPort: UserPort;
  private readonly pubSub: PubSub;
  private readonly currentUser: User;

  constructor({ userPort, pubSub, currentUser }: Dependencies) {
    this.userPort = userPort;
    this.pubSub = pubSub;
    this.currentUser = currentUser;
  }

  subscribe = withFilter(
    () => this.pubSub.asyncIterator([RtcIceCandidateReceivedEvent.TYPE]),
    (event: RtcIceCandidateReceivedEvent) =>
      this.currentUser.id.is(UserId.fromString(event.recipientId))
  );

  async resolve(
    event: RtcIceCandidateReceivedEvent
  ): Promise<{
    sender: User;
    iceCandidate: IceCandidate;
  }> {
    log("resolve");
    const sender = await this.userPort.findUserById(
      UserId.fromString(event.senderId)
    );

    return {
      sender,
      iceCandidate: event.iceCandidate,
    };
  }
}
