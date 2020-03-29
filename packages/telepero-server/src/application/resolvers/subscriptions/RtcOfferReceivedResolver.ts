import { PubSub, withFilter } from "apollo-server-koa";
import debug from "debug";

import { RtcOfferReceivedEvent } from "../../../domain/events/RtcOfferReceivedEvent";
import { User } from "../../../domain/entities/User";
import { SubscriptionResolver } from "./types";

interface Dependencies {
  pubSub: PubSub;
  currentUser: User;
}

interface RtcOfferReceivedResult {
  senderId: string;
  offer: {
    type: string
    sdp: string
  };
}

const log = debug("app:resolver:RtcfferReceivedResolver");

export class RtcOfferReceivedResolver
  implements
    SubscriptionResolver<RtcOfferReceivedEvent, void, RtcOfferReceivedResult> {
  private readonly pubSub: PubSub;
  private readonly currentUser: User;

  constructor({ pubSub, currentUser }: Dependencies) {
    this.pubSub = pubSub;
    this.currentUser = currentUser;
  }

  subscribe = withFilter(
    () => this.pubSub.asyncIterator([RtcOfferReceivedEvent.TYPE]),
    (event: RtcOfferReceivedEvent) =>
      this.currentUser.id.equals(event.recipientId)
  );

  resolve(event: RtcOfferReceivedEvent) {
    log("resolve");

    return {
      senderId: event.senderId.get(),
      offer: event.offer,
    };
  }
}
