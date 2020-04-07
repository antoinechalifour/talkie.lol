import { PubSub, withFilter } from "apollo-server-koa";
import debug from "debug";

import { RtcAnswerReceivedEvent } from "../../../domain/events/RtcAnswerReceivedEvent";
import { User } from "../../../domain/entities/User";
import { UserPort } from "../../../usecase/ports/UserPort";
import { SubscriptionResolver } from "./types";

interface Dependencies {
  userPort: UserPort;
  pubSub: PubSub;
  currentUser: User;
}

interface RtcAnswerReceivedResult {
  sender: User;
  answer: {
    type: string;
    sdp: string;
  };
}

const log = debug("app:resolver:RtcAnswerReceivedResolver");

export class RtcAnswerReceivedResolver
  implements
    SubscriptionResolver<
      RtcAnswerReceivedEvent,
      void,
      RtcAnswerReceivedResult
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
    () => this.pubSub.asyncIterator([RtcAnswerReceivedEvent.TYPE]),
    (event: RtcAnswerReceivedEvent) =>
      this.currentUser.id.equals(event.recipientId)
  );

  async resolve(event: RtcAnswerReceivedEvent) {
    log("resolve");
    const sender = await this.userPort.findUserById(event.senderId);

    return {
      sender,
      answer: event.answer,
    };
  }
}
