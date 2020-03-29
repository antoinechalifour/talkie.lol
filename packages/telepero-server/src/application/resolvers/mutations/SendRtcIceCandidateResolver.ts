import debug from "debug";

import { SendRtcIceCandidate } from "../../../usecase/SendRtcIceCandidate";
import { MutationArguments, MutationResolver } from "./types";

interface SendRtcIceCandidateArguments {
  iceCandidate: string;
  recipientId: string;
}

interface SendRtcIceCandidateResult {
  success: boolean;
}

interface Dependencies {
  sendRtcIceCandidate: SendRtcIceCandidate;
}

const log = debug("app:resolver:SendRtcIceCandidateResolver");

export class SendRtcIceCandidateResolver
  implements
    MutationResolver<
      unknown,
      SendRtcIceCandidateArguments,
      SendRtcIceCandidateResult
    > {
  private readonly sendRtcIceCandidate: SendRtcIceCandidate;

  constructor({ sendRtcIceCandidate }: Dependencies) {
    this.sendRtcIceCandidate = sendRtcIceCandidate;
  }

  async resolve(
    obj: unknown,
    { args }: MutationArguments<SendRtcIceCandidateArguments>
  ): Promise<SendRtcIceCandidateResult> {
    log("resolve");

    await this.sendRtcIceCandidate.execute(args.iceCandidate, args.recipientId);

    return { success: true };
  }
}
