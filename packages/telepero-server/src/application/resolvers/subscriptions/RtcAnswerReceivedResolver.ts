import { PubSub, withFilter } from "apollo-server-koa";
import debug from "debug";

import { RtcAnswerReceivedEvent } from "../../../domain/events/RtcAnswerReceivedEvent";
import { User } from "../../../domain/entities/User";
import { SubscriptionResolver } from "./types";

interface Dependencies {
  pubSub: PubSub;
  currentUser: User;
}

interface RtcAnswerReceivedResult {
  senderId: string;
  answer: {
    type: string,
    sdp: string
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
  private readonly pubSub: PubSub;
  private readonly currentUser: User;

  constructor({ pubSub, currentUser }: Dependencies) {
    this.pubSub = pubSub;
    this.currentUser = currentUser;
  }

  subscribe = withFilter(
    () => this.pubSub.asyncIterator([RtcAnswerReceivedEvent.TYPE]),
    (event: RtcAnswerReceivedEvent) =>
      this.currentUser.id.equals(event.recipientId)
  );

  resolve(event: RtcAnswerReceivedEvent) {
    log("resolve");

    return {
      senderId: event.senderId.get(),
      answer: event.answer,
    };
  }
}
