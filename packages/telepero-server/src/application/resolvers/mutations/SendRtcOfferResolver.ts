import debug from "debug";

import { SendRtcOffer } from "../../../usecase/SendRtcOffer";
import { MutationArguments, MutationResolver } from "./types";

interface SendRtcOfferArguments {
  offer: string;
  recipientId: string;
}

interface SendRtcOfferResult {
  success: boolean;
}

interface Dependencies {
  sendRtcOffer: SendRtcOffer;
}

const log = debug("app:resolver:SendRtcOfferResolver");

export class SendRtcOfferResolver
  implements
    MutationResolver<unknown, SendRtcOfferArguments, SendRtcOfferResult> {
  private readonly sendRtcOffer: SendRtcOffer;

  constructor({ sendRtcOffer }: Dependencies) {
    this.sendRtcOffer = sendRtcOffer;
  }

  async resolve(
    obj: unknown,
    { args }: MutationArguments<SendRtcOfferArguments>
  ): Promise<SendRtcOfferResult> {
    log("resolve");

    await this.sendRtcOffer.execute(args.offer, args.recipientId);

    return { success: true };
  }
}
