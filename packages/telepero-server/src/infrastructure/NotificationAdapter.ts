import debug from "debug";
import { PubSub } from "apollo-server-koa";

import { Space } from "../domain/entities/Space";
import { User } from "../domain/entities/User";
import { RtcAnswerReceivedEvent } from "../domain/events/RtcAnswerReceivedEvent";
import { RtcIceCandidateReceivedEvent } from "../domain/events/RtcIceCandidateReceivedEvent";
import { RtcOfferReceivedEvent } from "../domain/events/RtcOfferReceivedEvent";
import { SpaceJoinedEvent } from "../domain/events/SpaceJoinedEvent";
import { SpaceLeftEvent } from "../domain/events/SpaceLeftEvent";
import { SessionDescription } from "../domain/entities/SessionDescription";
import { NotificationPort } from "../usecase/ports/NotificationPort";
import {IceCandidate} from "../domain/entities/IceCandidate";

interface Dependencies {
  pubSub: PubSub;
}

const log = debug("app:adapter:notification");

export class NotificationAdapter implements NotificationPort {
  private readonly pubSub: PubSub;

  constructor({ pubSub }: Dependencies) {
    this.pubSub = pubSub;
  }

  notifyRtcAnswerReceived(
    answer: SessionDescription,
    sender: User,
    recipient: User
  ): void {
    const event = RtcAnswerReceivedEvent.create(answer, sender, recipient);

    log(event.format());

    this.pubSub.publish(event.type, event);
  }

  notifyRtcIceCandidateReceived(
    iceCandidate: IceCandidate,
    sender: User,
    recipient: User
  ): void {
    const event = RtcIceCandidateReceivedEvent.create(
      iceCandidate,
      sender,
      recipient
    );

    log(event.format());

    this.pubSub.publish(event.type, event);
  }

  notifyRtcOfferReceived(
    offer: SessionDescription,
    sender: User,
    recipient: User
  ): void {
    const event = RtcOfferReceivedEvent.create(offer, sender, recipient);

    log(event.format());

    this.pubSub.publish(event.type, event);
  }

  notifySpaceJoined(space: Space, user: User): void {
    const event = SpaceJoinedEvent.create(space, user);

    log(event.format());

    this.pubSub.publish(event.type, event);
  }

  notifySpaceLeft(space: Space, user: User): void {
    const event = SpaceLeftEvent.create(space, user);

    log(event.format());

    this.pubSub.publish(event.type, event);
  }
}
