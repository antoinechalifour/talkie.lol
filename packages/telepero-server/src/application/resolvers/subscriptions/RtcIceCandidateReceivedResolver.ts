import { PubSub, withFilter } from "apollo-server-koa";
import debug from "debug";

import { RtcIceCandidateReceivedEvent } from "../../../domain/events/RtcIceCandidateReceivedEvent";
import { User } from "../../../domain/entities/User";
import { SubscriptionResolver } from "./types";

interface Dependencies {
  pubSub: PubSub;
  currentUser: User;
}

interface RtcIceCandidateReceivedResult {
  iceCandidate: string;
  senderId: string;
}

const log = debug("app:resolver:RtcIceCandidateReceivedResolver");

export class RtcIceCandidateReceivedResolver
  implements
    SubscriptionResolver<
      RtcIceCandidateReceivedEvent,
      void,
      RtcIceCandidateReceivedResult
    > {
  private readonly pubSub: PubSub;
  private readonly currentUser: User;

  constructor({ pubSub, currentUser }: Dependencies) {
    this.pubSub = pubSub;
    this.currentUser = currentUser;
  }

  subscribe = withFilter(
    () => this.pubSub.asyncIterator([RtcIceCandidateReceivedEvent.TYPE]),
    (event: RtcIceCandidateReceivedEvent) =>
      this.currentUser.id.equals(event.recipientId)
  );

  resolve(event: RtcIceCandidateReceivedEvent) {
    log("resolve");

    return {
      senderId: event.senderId.get(),
      iceCandidate: event.iceCandidate,
    };
  }
}
